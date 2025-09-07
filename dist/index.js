import { Client, GatewayIntentBits, REST, Routes, Collection } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".ts"));
const commandCollection = new Collection();
for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    commands.push(command.data.toJSON());
    commandCollection.set(command.data.name, command);
}
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
        console.log("🤖 Comandos registrados com sucesso!");
    }
    catch (error) {
        console.error(error);
    }
})();
client.on("ready", () => {
    console.log(`✅ Bot conectado como ${client.user?.tag}`);
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const command = commandCollection.get(interaction.commandName);
    if (!command)
        return;
    try {
        await command.execute(interaction);
    }
    catch (err) {
        console.error(err);
        await interaction.reply({ content: "Erro ao executar o comando.", ephemeral: true });
    }
});
client.login(process.env.DISCORD_TOKEN);
