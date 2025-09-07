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

function salvarFilmes(filmes: any) {
    fs.writeFileSync(filePath, JSON.stringify(filmes, null, 2));
}

export const data = new SlashCommandBuilder()
    .setName("remover")
    .setDescription("Remove um filme por nome ou ID")
    .addStringOption(option =>
        option.setName("nome").setDescription("Nome do filme")
    )
    .addIntegerOption(option =>
        option.setName("id").setDescription("ID do filme")
    );

export async function execute(interaction: any) {
    const nome = interaction.options.getString("nome");
    const id = interaction.options.getInteger("id");

    if (!nome && !id) {
        await interaction.reply("❗ Forneça o nome ou o ID do filme");
        return;
    }

    let filmes = carregarFilmes();

    let indexRemovido = -1;
    if (id) {
        indexRemovido = filmes.findIndex((f: any) => f.id === id);
    } else if (nome) {
        indexRemovido = filmes.findIndex((f: any) => f.nome.toLowerCase() === nome.toLowerCase());
    }

    if (indexRemovido === -1) {
        await interaction.reply("❌ Filme não encontrado");
        return;
    }

    filmes.splice(indexRemovido, 1);

    // Reatribuir os IDs para manter a sequência contínua
    filmes = filmes.map((filme: any, index: number) => ({
        id: index + 1,
        nome: filme.nome,
    }));

    salvarFilmes(filmes);
    await interaction.reply("🗑️ Filme removido com sucesso");
}
