import { SlashCommandBuilder } from "discord.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/filmes.json");

function carregarFilmes() {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export const data = new SlashCommandBuilder()
    .setName("listar")
    .setDescription("Lista todos os filmes");

export async function execute(interaction: any) {
    const filmes = carregarFilmes();

    if (filmes.length === 0) {
        await interaction.reply("📭 Nenhum filme na lista");
        return;
    }

    const lista = filmes.map((f: any) => `#${f.id}. ${f.nome}`).join("\n");
    await interaction.reply(`🎬 Lista de Filmes:\n${lista}`);
}
