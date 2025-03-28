import { fields } from "./retrieveHtmlFormFields"


// Add button to Actor Sheet for opening app
Hooks.on("getActorSheetHeaderButtons", (app, buttons) => {
    console.log("Checking actor sheet:", app);

    if (!["character", "PC", "Player", "npc", "pc"].includes(app.actor.type)) return;

    buttons.unshift({
        label: "Export Character Sheet",
        class: "export-pdf",
        icon: "fas fa-file-export",
        onclick: () => openCharacterSheet(app.actor),
    });
});


// Função para exibir a ficha personalizada
async function openCharacterSheet(actor) {
    // Carrega o template HTML da ficha personalizada
    let template = await renderTemplate("modules/export-character-sheet/templates/Character-Sheet.html", { actor });

    new Dialog({
        title: `${actor.name}'s Character Sheet`,
        content: template,
        buttons: {
            print: {
                label: "Print",
                callback: () => {
                    var printContents = document.getElementById("charsheet").innerHTML;
                    const printWindow = window.open("", "_blank");
                    printWindow.document.write(printContents);
                    printWindow.print();
                    printWindow.document.close();
                }
            },
            close: {
                label: "Close",
                callback: () => console.log("Fechando")
            }
        },
        render: (html) => fillCharacterSheet(html, actor)
    }).render(true);
}


function fillCharacterSheet(html, actor) {

    fields.name.val(actor.name);
    fields.classLevel.val(actor.items.filter(i => i.type === 'class').map(i => `${i.name} ${i.system.levels}`).join(' / '));
    fields.background.val(actor.items.find((item) => item.type === 'background')?.name);
    fields.playerName.val(Object.entries(actor.ownership).filter(entry => entry[1] === 3).map(entry => entry[0]).map(id => !game.users.get(id)?.isGM ? game.users.get(id)?.name : null).filter(x => x).join(", "))
    fields.race.val(actor.system.details.race);
    fields.alignment.val(actor.system.details.alignment);
    fields.experiencePoints.val(actor.system.details.xp.value);
    fields.inspiration.val(actor.system.attributes.inspiration ? "x" : "");
    fields.proficiencyBonus.val(actor.system.attributes.prof);

}