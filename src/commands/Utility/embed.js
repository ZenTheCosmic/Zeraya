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
        .setDescription('Embed description')
        .setRequired(true)
    ),

  async execute(interaction) {
    const color = interaction.options.getString('color');
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');

    const embed = createEmbed({
      title,
      description
    }).setColor(color);

    await interaction.reply({ embeds: [embed] });
  }
};
