// TODO: Add different speeches
// TODO: Add attack functions to grimhollow and boneshard

const wraithmoor = {
    name: "Captain Wraithmoor",
    difficulty: "easy",
    speech: ["You can't escape me!", "Prepare for your doom!"],
    attack: function(availableTargets) {
        if (availableTargets.length == 0) return;

        let index = Math.floor(Math.random() * availableTargets.length);

        let randomField = availableTargets[index];

        setTimeout(() => {
            randomField.click();
        }, 1200);   

        availableTargets.splice(index, 1);
    },
    styling: {
        backGroundColorBoard: "var(--limeGreen)",  
        playerBoardBoxShadow: "2px 2px 10px var(--limeGreen)",
    },
    ships: {
        shipImage1: "./img/wraithmoor/ghost_1.png",
        shipImage2: "./img/wraithmoor/ghost_2.png",
        shipImage3: "./img/wraithmoor/ghost_3.png",
        shipImage4: "./img/wraithmoor/ghost_4.png",
        shipImage5: "./img/wraithmoor/ghost_5.png",
    }
};

const grimhollow = {
    name: "Captain Grimhollow",
    difficulty: "medium",
    speech: ["You can't escape me!", "Prepare for your doom!"],
    attack: function(availableTargets) {
        // if (availableTargets.length == 0) return;

        // let index = Math.floor(Math.random() * availableTargets.length);

        // let randomField = availableTargets[index];

        // setTimeout(() => {
        //     randomField.click();
        // }, 1200);   

        // availableTargets.splice(index, 1);
    },
    styling: {
        backGroundColorBoard: "var(--goldenYellow)",  
        playerBoardBoxShadow: "2px 2px 10px var(--goldenYellow)",
    },
    ships: {
        shipImage1: "./img/grimhollow/zombie_1.png",
        shipImage2: "./img/grimhollow/zombie_2.png",
        shipImage3: "./img/grimhollow/zombie_3.png",
        shipImage4: "./img/grimhollow/zombie_4.png",
        shipImage5: "./img/grimhollow/zombie_5.png",
    }
};

const boneshard = {
    name: "Captain Boneshard",
    difficulty: "hard",
    speech: ["You can't escape me!", "Prepare for your doom!"],
    attack: function(availableTargets) {
        // if (availableTargets.length == 0) return;

        // let index = Math.floor(Math.random() * availableTargets.length);

        // let randomField = availableTargets[index];

        // setTimeout(() => {
        //     randomField.click();
        // }, 1200);   

        // availableTargets.splice(index, 1);
    },
    styling: {
        backGroundColorBoard: "var(--glowingOrange)",  
        playerBoardBoxShadow: "2px 2px 10px var(--glowingOrange)",
    },
    ships: {
        shipImage1: "./img/boneshard/skeleton_1.png",
        shipImage2: "./img/boneshard/skeleton_2.png",
        shipImage3: "./img/boneshard/skeleton_3.png",
        shipImage4: "./img/boneshard/skeleton_4.png",
        shipImage5: "./img/boneshard/skeleton_5.png",
    }
};

const human = {
    styling: {
        backGroundColorBoard: "var(--electricBlue)",  
        playerBoardBoxShadow: "2px 2px 10px var(--electricBlue)",
    },
    ships: {
        shipImage1: "./img/human/human_1.png",
        shipImage2: "./img/human/human_2.png",
        shipImage3: "./img/human/human_3.png",
        shipImage4: "./img/human/human_4.png",
        shipImage5: "./img/human/human_5.png",

        // TODO: ADD human ships
    }
};