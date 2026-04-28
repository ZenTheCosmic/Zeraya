import { Events, EmbedBuilder } from 'discord.js';

export default {
  name: Events.GuildMemberRemove,
  once: false,

  async execute(member) {

    const channel = member.guild.channels.cache.get("1489566955290755203");
    if (!channel) return console.log("❌ Leave channel not found");

    try {
      const embed = new EmbedBuilder()
        .setColor("#81058D")
        .setTitle("👋 Goodbye from Zeraya McLegacy")
        .setDescription(
`<@${member.id}> has left the server.

We hope to see you again someday 💔`
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setFooter({
          text: `Member #${member.guild.memberCount}`
        })
        .setTimestamp();

      await channel.send({ embeds: [embed] });

    } catch (err) {
      console.error("❌ Leave Error:", err);
    }
  }
};
