
import { Events, EmbedBuilder } from 'discord.js';

export default {
  name: Events.GuildBanAdd,
  once: false,

  async execute(ban) {

    const channel = ban.guild.channels.cache.get("1489567134521753761");
    if (!channel) return console.log("❌ Ban channel not found");

    try {
      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("🚫 User Banned")
        .setDescription(
`<@${ban.user.id}> has been permanently removed from the server.`
        )
        .setThumbnail(ban.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setFooter({
          text: `Member #${ban.guild.memberCount}`
        })
        .setTimestamp();

      await channel.send({ embeds: [embed] });

    } catch (err) {
      console.error("❌ Ban Error:", err);
    }
  }
};
