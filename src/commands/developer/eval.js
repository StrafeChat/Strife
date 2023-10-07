const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getCode, clean } = require("@elara-services/eval-helper");
const ownerids = ["529815278456930314", "772176688980557846"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates Javascript code in a command.')
        .addStringOption((option =>
            option.setName('code')
                .setDescription('The code to evaluate.')
                .setRequired(true))),
    async execute(interaction) {
        const input = interaction.options.getString('code');
        if (!ownerids.includes(interaction.user.id)) return interaction.reply({ content: "Only the developer can run this command.", ephemeral: true });
        try {
            const evaled = await getCode({ code: input });
            const code = await clean(eval(evaled), [interaction.client.token]);
            const embed = new EmbedBuilder()
                .addFields({ name: "Output", value: `\`\`\`js\n${code}\`\`\`` })
            return interaction.reply({ embeds: [embed] });
        } catch (e) {
            const errorEmbed = new EmbedBuilder()
                .setDescription(`There was an error during evaluation.\n\`\`\`js\n${e}\`\`\``)
            return interaction.reply({ embeds: [errorEmbed] })
        }
    },
};