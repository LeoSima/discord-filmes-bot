import { SlashCommandBuilder } from "discord.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../data/filmes.json');

function carregarFilmes() {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function salvarFilmes(filmes: any) {
    fs.writeFileSync(filePath, JSON.stringify(filmes, null, 2));
}

export const data = new SlashCommandBuilder()
    .setName("sugerir")
    .setDescription("Adiciona um filme na lista")
    .addStringOption(option =>
        option.setName("nome")
            .setDescription("Nome do filme")
            .setRequired(true)
        );

export async function execute(interaction: any) {
    const nome = interaction.options.getString("nome");
    const filmes = carregarFilmes();
    const novoId = filmes.length + 1;

    filmes.push({ id: novoId, nome });
    salvarFilmes(filmes);

    await interaction.reply(`🎬 Filme "${nome}" adicionado. ID: ${novoId}`);
}

