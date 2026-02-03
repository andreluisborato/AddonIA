let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

installBtn.addEventListener('click', () => {
    deferredPrompt.prompt();
    installBtn.style.display = 'none';
});

function toggleFields() {
    const type = document.getElementById('addonType').value;
    const editor = document.getElementById('editor3DContainer');
    editor.style.display = (type === 'block') ? 'block' : 'none';
}

async function generateAddon() {
    const name = document.getElementById('addonName').value;
    const type = document.getElementById('addonType').value;
    const ns = document.getElementById('namespace').value;
    const texture = document.getElementById('textureFile').files[0];

    if (!name || !ns) {
        alert("Preencha o nome e o namespace!");
        return;
    }

    const zip = new JSZip();
    const uuidBP = crypto.randomUUID();
    const uuidRP = crypto.randomUUID();

    // Manifestos
    const manifestBP = {
        format_version: 2,
        header: { name: `${name} BP`, description: "Gerado por AddonIA", uuid: uuidBP, version: [1, 0, 0], min_engine_version: [1, 16, 0] },
        modules: [{ type: "data", uuid: crypto.randomUUID(), version: [1, 0, 0] }]
    };

    const manifestRP = {
        format_version: 2,
        header: { name: `${name} RP`, description: "Gerado por AddonIA", uuid: uuidRP, version: [1, 0, 0], min_engine_version: [1, 16, 0] },
        modules: [{ type: "resources", uuid: crypto.randomUUID(), version: [1, 0, 0] }]
    };

    zip.file("BP/manifest.json", JSON.stringify(manifestBP, null, 2));
    zip.file("RP/manifest.json", JSON.stringify(manifestRP, null, 2));

    // Lógica simples de item/bloco
    const fileName = name.toLowerCase().replace(/\s+/g, '_');
    if (type === 'item') {
        const itemJson = {
            format_version: "1.16.0",
            "minecraft:item": {
                description: { identifier: `${ns}:${fileName}` },
                components: { "minecraft:icon": fileName, "minecraft:display_name": { value: name } }
            }
        };
        zip.file(`BP/items/${fileName}.json`, JSON.stringify(itemJson, null, 2));
    }

    if (texture) {
        zip.file(`RP/textures/items/${fileName}.png`, texture);
    }

    // Exportar
    zip.generateAsync({ type: "blob" }).then(function (content) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${fileName}.mcaddon`;
        link.click();
        alert("Addon gerado com sucesso!");
    });
}

// Mock de Editor 3D (Canvas simplificado)
const canvas = document.getElementById('canvas3D');
if(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#ccc";
    ctx.fillRect(50, 50, 100, 100);
    ctx.fillText("Preview 3D Ativo", 60, 110);
}