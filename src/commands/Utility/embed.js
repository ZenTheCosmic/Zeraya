import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create a custom embed')

    .addStringOption(option =>
      option.setName('color')
        .setDescription('Hex color (#ff00e9)')
        .setRequired(true)
    )

    .addStringOption(option =>
      option.setName('title')
        .setDescription('Embed title')
        .setRequired(true)
    )

    .addStringOption(option =>
      option.setName('description')
        .setDescription('Embed description')
        .setRequired(true)
    )

    .addUserOption(option =>
      option.setName('user')
        .setDescription('User for avatar/mention')
    )

    .addStringOption(option =>
      option.setName('thumbnail')
        .setDescription('Thumbnail URL OR "user"')
    )

    .addStringOption(option =>
      option.setName('image')
        .setDescription('Image URL')
    )

    .addStringOption(option =>
      option.setName('author')
        .setDescription('Author name')
    )

    .addStringOption(option =>
      option.setName('footer')
        .setDescription('Footer text')
    )

    .addBooleanOption(option =>
      option.setName('timestamp')
        .setDescription('Add timestamp')
    ),

  async execute(interaction) {

    // ✅ VERY IMPORTANT (prevents "interaction failed")
    await interaction.deferReply();

    try {
      const colorInput = interaction.options.getString('color');
      const title = interaction.options.getString('title');
      let description = interaction.options.getString('description');

      const user = interaction.options.getUser('user') || interaction.user;

      const thumbnail = interaction.options.getString('thumbnail');
      const image = interaction.options.getString('image');
      const author = interaction.options.getString('author');
      const footer = interaction.options.getString('footer');
      const timestamp = interaction.options.getBoolean('timestamp');

      // ✅ FIX COLOR (auto add # if missing)
      const color = colorInput.startsWith('#') ? colorInput : `#${colorInput}`;

      // ✅ Replace variables like your old bot
      description = description
        .replace(/{user\.mention}/g, `<@${user.id}>`)
        .replace(/{user\.avatar}/g, user.displayAvatarURL({ dynamic: true }));

      const embed = createEmbed({
        title,
        description
      }).setColor(color);

      // 👤 AUTHOR
      if (author) {
        embed.setAuthor({
          name: author,
          iconURL: user.displayAvatarURL({ dynamic: true })
        });
      }

      // 🖼️ THUMBNAIL
      if (thumbnail) {
        if (thumbnail.toLowerCase() === "user") {
          embed.setThumbnail(user.displayAvatarURL({ dynamic: true }));
        } else {
          embed.setThumbnail(thumbnail);
        }
      }

      // 🌆 IMAGE
      if (image) embed.setImage(image);

      // 🦶 FOOTER
      if (footer) {
        embed.setFooter({
          text: footer,
          iconURL: user.displayAvatarURL({ dynamic: true })
        });
      }

      // ⏱️ TIMESTAMP
      if (timestamp) embed.setTimestamp();

      // ✅ SEND FINAL EMBED
      await interaction.editReply({
        embeds: [embed]
      });

    } catch (err) {
      console.error("EMBED ERROR:", err);

      // ✅ SAFE ERROR RESPONSE
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: "❌ Something broke while creating the embed."
        });
      } else {
        await interaction.reply({
          content: "❌ Something broke.",
          ephemeral: true
        });
      }
    }
  }
};
