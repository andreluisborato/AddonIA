// Função para gerar UUIDs (essencial para o Minecraft reconhecer o addon)
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function generateAddon() {
    const name = document.getElementById('addonName').value;
    const type = document.getElementById('addonType').value;
    const ns = document.getElementById('namespace').value;
    const textureFile = document.getElementById('textureFile').files[0];

    if (!name || !ns) {
        alert("⚠️ Por favor, preencha o nome e o namespace!");
        return;
    }

    const zip = new JSZip();
    const id = name.toLowerCase().replace(/\s+/g, '_');
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    const uuid3 = generateUUID();
    const uuid4 = generateUUID();

    // --- ESTRUTURA DO BEHAVIOR PACK (BP) ---
    const bpManifest = {
        format_version: 2,
        header: {
            name: `${name} BP`,
            description: "Criado no AddonIA",
            uuid: uuid1,
            version: [1, 0, 0],
            min_engine_version: [1, 16, 0]
        },
        modules: [{
            description: "Behavior Pack Module",
            type: "data",
            uuid: uuid2,
            version: [1, 0, 0]
        }]
    };
    zip.file("BP/manifest.json", JSON.stringify(bpManifest, null, 2));

    // Lógica para ITENS
    if (type === 'item') {
        const itemJson = {
            format_version: "1.16.100",
            "minecraft:item": {
                description: {
                    identifier: `${ns}:${id}`,
                    category: "items"
                },
                components: {
                    "minecraft:icon": id,
                    "minecraft:display_name": { "value": name },
                    "minecraft:max_stack_size": 64
                }
            }
        };
        zip.file(`BP/items/${id}.json`, JSON.stringify(itemJson, null, 2));
    }

    // --- ESTRUTURA DO RESOURCE PACK (RP) ---
    const rpManifest = {
        format_version: 2,
        header: {
            name: `${name} RP`,
            description: "Criado no AddonIA",
            uuid: uuid3,
            version: [1, 0, 0],
            min_engine_version: [1, 16, 0]
        },
        modules: [{
            description: "Resource Pack Module",
            type: "resources",
            uuid: uuid4,
            version: [1, 0, 0]
        }]
    };
    zip.file("RP/manifest.json", JSON.stringify(rpManifest, null, 2));

    // Item Texture (Necessário para o ícone aparecer)
    const itemTextureJson = {
        resource_pack_name: "AddonIA",
        texture_name: "atlas.items",
        texture_data: {}
    };
    itemTextureJson.texture_data[id] = { textures: `textures/items/${id}` };
    zip.file("RP/textures/item_texture.json", JSON.stringify(itemTextureJson, null, 2));

    // Processar Imagem se houver
    if (textureFile) {
        const textureData = await textureFile.arrayBuffer();
        zip.file(`RP/textures/items/${id}.png`, textureData);
    }

    // --- FINALIZAÇÃO E DOWNLOAD ---
    zip.generateAsync({ type: "blob" }).then(function (content) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${id}.mcaddon`;
        link.click();
        
        // Feedback visual
        const btn = document.querySelector('.btn-primary');
        btn.innerText = "✅ Addon Baixado!";
        setTimeout(() => btn.innerText = "Gerar e Baixar .mcaddon", 3000);
    });
}