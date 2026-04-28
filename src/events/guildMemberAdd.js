import { Events, EmbedBuilder } from 'discord.js';

export default {
  name: Events.GuildMemberAdd,
  once: false,

  async execute(member) {

    // 🎯 YOUR WELCOME CHANNEL ID
    const channel = member.guild.channels.cache.get("1434403930653069430");
    if (!channel) return console.log("❌ Welcome channel not found");

    try {
      const embed = new EmbedBuilder()
        .setColor("#ff00e9")
        .setTitle("🎉 Welcome to Zeraya McLegacy!")
        .setDescription(
`Hello <@${member.id}> 👋

Welcome to **Zeraya Legacy!**

🧱 Survival • ⚔️ PvP • 🏗️ Building  
🔴 Redstone • 🌍 Exploration  

📜 Read the rules in <#1434403930653069431>  
💬 Chat with others in <#1434403931601113199>  

Enjoy your stay and have fun! ✨`
        )
        // 👤 USER AVATAR (FIXED CLEAN)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))

        // 👥 MEMBER COUNT
        .setFooter({
          text: `Member #${member.guild.memberCount}`
        })

        // 🕒 DATE & TIME
        .setTimestamp();

      await channel.send({ embeds: [embed] });

    } catch (err) {
      console.error("❌ Welcome Error:", err);
    }
  }
};
