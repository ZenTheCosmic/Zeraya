import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create a clean embed')

    .addStringOption(o =>
      o.setName('color')
        .setDescription('Hex color (#ff00e9)')
        .setRequired(true))

    .addStringOption(o =>
      o.setName('title')
        .setDescription('Embed title')
        .setRequired(true))

    .addStringOption(o =>
      o.setName('description')
        .setDescription('Embed description')
        .setRequired(true))

    .addUserOption(o =>
      o.setName('user')
        .setDescription('User for variables')
        .setRequired(false))

    .addStringOption(o =>
      o.setName('thumbnail')
        .setDescription('"user" or image URL')
        .setRequired(false))

    .addStringOption(o =>
      o.setName('image')
        .setDescription('Image URL')
        .setRequired(false))

    .addStringOption(o =>
      o.setName('footer')
        .setDescription('Footer text')
        .setRequired(false))

    .addStringOption(o =>
      o.setName('author')
        .setDescription('Author name')
        .setRequired(false))

    .addBooleanOption(o =>
      o.setName('timestamp')
        .setDescription('Show timestamp?')
        .setRequired(false)),

  async execute(interaction) {
    try {
      const color = interaction.options.getString('color');
      const title = interaction.options.getString('title');
      let description = interaction.options.getString('description');

      const targetUser =
        interaction.options.getUser('user') || interaction.user;

      const thumbnail = interaction.options.getString('thumbnail');
      const image = interaction.options.getString('image');
      const footer = interaction.options.getString('footer');
      const author = interaction.options.getString('author');
      const timestamp = interaction.options.getBoolean('timestamp');

      // ✅ VARIABLES
      description = description
        .replace(/{user}/g, `<@${targetUser.id}>`)
        .replace(/{user\.mention}/g, `<@${targetUser.id}>`)
        .replace(/{user\.avatar}/g, targetUser.displayAvatarURL({ dynamic: true }));

      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);

      // =========================
      // 🔥 TIMESTAMP (NO BUG)
      // =========================
      if (timestamp === true) {
        embed.setTimestamp();
      } else {
        embed.setTimestamp(null);
      }

      // =========================
      // 🔥 THUMBNAIL (NO DUPLICATE)
      // =========================
      embed.setThumbnail(null);

      if (thumbnail) {
        if (thumbnail.toLowerCase() === 'user') {
          embed.setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));
        } else if (thumbnail.startsWith('http')) {
          embed.setThumbnail(thumbnail);
        }
      }

      // =========================
      // 🔥 IMAGE
      // =========================
      if (image && image.startsWith('http')) {
        embed.setImage(image);
      }

      // =========================
      // 🔥 AUTHOR
      // =========================
      if (author) {
        embed.setAuthor({
          name: author,
          iconURL: targetUser.displayAvatarURL({ dynamic: true })
        });
      }

      // =========================
      // 🔥 FOOTER
      // =========================
      if (footer) {
        embed.setFooter({ text: footer });
      }

      // ✅ CLEAN REPLY (NO ERROR)
      await interaction.reply({
        embeds: [embed]
      });

    } catch (err) {
      console.error(err);

      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Failed to create embed.',
          ephemeral: true
        });
      }
    }
  }
};
