import { SlashCommandBuilder } from "discord.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../../data/filmes.json");

function carregarFilmes() {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export const data = new SlashCommandBuilder()
    .setName("sortear")
    .setDescription("Sorteia um filme aleatório da lista");

export async function execute(interaction: any) {
    const filmes = carregarFilmes();

    if (filmes.length === 0) {
        await interaction.reply("📭 Nenhum filme na lista para sortear");
        return;
    }

    const filme = filmes[Math.floor(Math.random() * filmes.length)];
    await interaction.reply(`🎲 Filme sorteado: \n${filme.id}. ${filme.nome}`);
}

