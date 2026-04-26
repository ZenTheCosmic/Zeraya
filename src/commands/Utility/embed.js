import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create a simple embed')

    .addStringOption(option =>
      option.setName('color')
        .setDescription('Hex color (example: #ff00e9)')
        .setRequired(true)
    )

    .addStringOption(option =>
      option.setName('title')
        .setDescription('Embed title')
        .setRequired(true)
    )

    .addStringOption(option =>
      option.setName('description')
        .setDescription('Embed description (supports {user.mention})')
        .setRequired(true)
    )

    // ✅ NEW: user option
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to use in embed')
        .setRequired(false)
    )

    // ✅ NEW: thumbnail toggle
    .addStringOption(option =>
      option.setName('thumbnail')
        .setDescription('Use "user" to show avatar or paste image URL')
        .setRequired(false)
    ),

  async execute(interaction) {
    const color = interaction.options.getString('color');
    const title = interaction.options.getString('title');
    let description = interaction.options.getString('description');

    const targetUser =
      interaction.options.getUser('user') || interaction.user;

    const thumbnailOption = interaction.options.getString('thumbnail');

    // ✅ Replace variables
    description = description
      .replace(/{user\.mention}/g, `<@${targetUser.id}>`)
      .replace(/{user\.avatar}/g, targetUser.displayAvatarURL({ dynamic: true }));

    const embed = createEmbed({
      title,
      description
    }).setColor(color);

    // ✅ Thumbnail logic
    if (thumbnailOption) {
      if (thumbnailOption === "user") {
        embed.setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));
      } else {
        embed.setThumbnail(thumbnailOption);
      }
    }

    // ✅ send clean embed
    await interaction.channel.send({ embeds: [embed] });

    // ✅ silent reply (no visible message)
    await interaction.deferReply({ ephemeral: true });
  }
};
