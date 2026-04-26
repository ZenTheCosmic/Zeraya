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
        .setDescription('Select a user (for avatar/mention)')
    )

    .addStringOption(option =>
      option.setName('thumbnail')
        .setDescription('"user" or image URL')
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
        .setDescription('Show embed timestamp')
    ),

  async execute(interaction) {
    try {
      const colorInput = interaction.options.getString('color');
      const title = interaction.options.getString('title');
      let description = interaction.options.getString('description');

      const selectedUser = interaction.options.getUser('user') || interaction.user;

      const thumbnail = interaction.options.getString('thumbnail');
      const image = interaction.options.getString('image');
      const author = interaction.options.getString('author');
      const footer = interaction.options.getString('footer');
      const timestamp = interaction.options.getBoolean('timestamp');

      // ✅ Clean color
      const color = colorInput.startsWith('#') ? colorInput : `#${colorInput}`;

      // ✅ Get avatar (clean, stable)
      const avatar = selectedUser.displayAvatarURL({
        extension: 'png', // prevents gif weirdness
        size: 512
      });

      // ✅ Replace mention variable (optional use)
      description = description
        .replace(/{user}/g, `<@${selectedUser.id}>`);

      const embed = createEmbed({
        title,
        description
      }).setColor(color);

      // 👤 Author
      if (author) {
        embed.setAuthor({
          name: author,
          iconURL: avatar
        });
      }

      // 🖼️ Thumbnail
      if (thumbnail) {
        if (thumbnail.toLowerCase() === 'user') {
          embed.setThumbnail(avatar);
        } else if (thumbnail.startsWith('http')) {
          embed.setThumbnail(thumbnail);
        }
      }

      // 🌆 Image
      if (image && image.startsWith('http')) {
        embed.setImage(image);
      }

      // 🦶 Footer
      if (footer) {
        embed.setFooter({
          text: footer,
          iconURL: avatar
        });
      }

      // ⏱️ Timestamp
      if (timestamp === true) {
        embed.setTimestamp();
      }

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
