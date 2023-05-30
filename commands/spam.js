const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, Colors } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spam')
		.setDescription('Control spam in your server.')
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('enable')
  			.setDescription('Enable spam filtering.'))
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('disable')
  			.setDescription('Disable spam filtering.'))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	async execute(interaction) {
    const rules = await interaction.guild.autoModerationRules.fetch();
    
    const existsEmbed = new EmbedBuilder()
    .setDescription("Rule already exists.")
    .setColor(Colors.Orange);

    switch(interaction.options.getSubcommand()) {
      case 'enable':
        if(rules.some(rule => rule.name === "Spam")) return await interaction.reply({ embeds: [existsEmbed] });
        
        const creatingEmbed = new EmbedBuilder()
          .setDescription("Creating spam rule...")
          .setColor(Colors.Yellow);
      
          await interaction.reply({ embeds: [creatingEmbed] });
          
          await interaction.guild.autoModerationRules.create({
            name: "Spam",
            eventType: 1,
            triggerType: 3,
            actions: [{
              type: 1
            }],
            enabled: true
          });
      
          const createdEmbed = new EmbedBuilder()
          .setDescription("Spam rule created!")
          .setColor(Colors.Green);
          return interaction.editReply({embeds: [createdEmbed]});
        
        break;
      case 'disable':
        const existingRule = rules.find(rule => rule.name === "Spam");
        if(!existingRule) return interaction.reply({ embeds: [ new EmbedBuilder().setDescription('Cannot disable, rule does not exist.').setColor(Colors.Red) ] });
        
        interaction.guild.autoModerationRules.delete(existingRule);
        const deletedEmbed = new EmbedBuilder()
          .setDescription("Spam rule deleted!")
          .setColor(Colors.Green);
          return interaction.reply({embeds: [deletedEmbed]});
        break;
    }
  }
};