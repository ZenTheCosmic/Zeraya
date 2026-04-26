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

      // ✅ Fix color (# auto)
      const color = colorInput.startsWith('#') ? colorInput : `#${colorInput}`;

      // ✅ Clean high-quality avatar (FAST + FIXED)
      const avatar = user.displayAvatarURL({
        dynamic: true,
        size: 1024
      });

      // ✅ Replace variables (like your old bot)
      description = description
        .replace(/{user\.mention}/g, `<@${user.id}>`)
        .replace(/{user\.avatar}/g, avatar);

      const embed = createEmbed({
        title,
        description
      }).setColor(color);

      // 👤 AUTHOR
      if (author) {
        embed.setAuthor({
          name: author,
          iconURL: avatar
        });
      }

      // 🖼️ THUMBNAIL
      if (thumbnail) {
        if (thumbnail.toLowerCase() === "user") {
          embed.setThumbnail(avatar);
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
          iconURL: avatar
        });
      }

      // ⏱️ TIMESTAMP
      if (timestamp) embed.setTimestamp();

      // ⚡ FAST SEND (no delay)
      await interaction.reply({
        embeds: [embed]
      });

    } catch (err) {
      console.error("EMBED ERROR:", err);

      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ Something broke.",
          ephemeral: true
        });
      }
    }
  }
};
