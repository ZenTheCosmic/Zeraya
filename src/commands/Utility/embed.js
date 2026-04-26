import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Advanced embed builder (multi-line)')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('Multi-line embed config')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const input = interaction.options.getString('input');

      // ✅ Parse lines
      const lines = input.split('\n');
      const data = {};

      for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (!key || valueParts.length === 0) continue;

        const value = valueParts.join(':').trim();
        data[key.trim().toLowerCase()] = value;
      }

      // ✅ Defaults
      let color = data.color || '#ff00e9';
      let title = data.title || null;
      let description = data.description || null;

      // ✅ USER
      let targetUser = interaction.user;

      if (data.user) {
        const idMatch = data.user.match(/\d+/);
        if (idMatch) {
          try {
            targetUser = await interaction.client.users.fetch(idMatch[0]);
          } catch {
            targetUser = interaction.user;
          }
        }
      }

      // ✅ Variables
      if (description) {
        description = description
          .replace(/{user}/g, `<@${targetUser.id}>`)
          .replace(/{user\.mention}/g, `<@${targetUser.id}>`)
          .replace(/{user\.avatar}/g, targetUser.displayAvatarURL({ dynamic: true }));
      }

      // ✅ Create embed
      const embed = createEmbed({
        title,
        description
      }).setColor(color);

      // =========================
      // 🔥 TIMESTAMP FIX
      // =========================
      if (data.timestamp) {
        if (data.timestamp.toLowerCase() === 'true') {
          embed.setTimestamp();
        } else {
          embed.setTimestamp(null);
        }
      } else {
        embed.setTimestamp(null);
      }

      // =========================
      // 🔥 THUMBNAIL FIX
      // =========================
      embed.setThumbnail(null); // reset first

      if (data.thumbnail) {
        if (data.thumbnail.toLowerCase() === 'user') {
          embed.setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));
        } else if (data.thumbnail.startsWith('http')) {
          embed.setThumbnail(data.thumbnail);
        }
      }

      // =========================
      // 🔥 IMAGE
      // =========================
      if (data.image && data.image.startsWith('http')) {
        embed.setImage(data.image);
      }

      // =========================
      // 🔥 FOOTER
      // =========================
      if (data.footer) {
        embed.setFooter({
          text: data.footer
        });
      }

      // =========================
      // 🔥 AUTHOR
      // =========================
      if (data.author) {
        embed.setAuthor({
          name: data.author,
          iconURL: targetUser.displayAvatarURL({ dynamic: true })
        });
      }

      // ✅ IMPORTANT: reply properly (NO FAIL)
      await interaction.reply({
        embeds: [embed]
      });

    } catch (err) {
      console.error(err);

      // fallback so no "interaction failed"
      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Error creating embed.',
          ephemeral: true
        });
      }
    }
  }
};
