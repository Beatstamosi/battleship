// TODO: Add attack functions to grimhollow and boneshard
function getSpeech(event) {
    return this.speech[event];
}

const wraithmoor = {
    name: "Captain Wraithmoor",
    difficulty: "easy",
    speech: {
        captainHit: "A hit! Your fleet will be claimed by the fog.",
        playerHit: "You think you've struck a blow? I'll return, stronger than before!",
        captainMiss: "A miss! The spirits are restless, but not yet in your favor.",
        playerMiss: "Your shot goes wide. You cannot escape the fog's grip.",
        captainSink: "Your fleet is no more. The fog devours all.",
        playerSink: "Impossible! How could my fleet vanish into the mist?",
        placeShips: "Place your ships carefully. The fog can turn the tide at any moment.",
        gameStart: "The fog rises. It's time to face the spirits of the deep.",
        captainWin: "You have lost, and now the fog will claim you. I shall never fade.",
        playerWin: "How...? My ghostly fleet cannot be defeated. But you've won this round, mortal."
    },
    getSpeech: getSpeech,
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
    speech: {
        captainHit: "Another strike! The dead will rise against you.",
        playerHit: "Ugh, you've struck my ship! But it won't stay down long!",
        captainMiss: "A futile strike! The undead will not falter.",
        playerMiss: "The undead remain unscathed. Try again, if you dare.",
        captainSink: "Your ships are lost to the deep, just as the living fade to dust.",
        playerSink: "No...! My undead will rise again, but not today!",
        placeShips: "The dead never rest. And neither should you. Place your ships wisely.",
        gameStart: "The undead rise again, and your fleet shall feel their wrath!",
        captainWin: "Your fleet is shattered, just like your hopes. The undead reign supreme!",
        playerWin: "Impossible! The dead never stay down... but you've won this time."
    },
    getSpeech: getSpeech,
    attack: function(availableTargets) {
        // if (availableTargets.length == 0) return;

        // let attackField;

        // if nextAttack empty
            // let index = Math.floor(Math.random() * availableTargets.length);
            // attackField = availableTargets[index];
        // else 
            // attackField = nextAttack.shift();

        // await simulateClickAndObserve
            // setTimeout(() => {
            //     attackField.click();
            // }, 1200);   

        // checkUpdatedField
        // if hit
            // clear nextAttack
            // if !attackField.ship.sunk
                // if lastSuccessAttack
                    // if attackField.row < lastSuccessAttack.row
                        // nextField = attackField.row - 1
                    // if attackField.row > lastSuccessAttack.row
                        // nextField = attackField.row + 1
                    // if attackField.column < lastSuccessAttack.column
                        // nextField = attackField.column - 1
                    // if attackField.column > lastSuccessAttack.column
                        // nextField = attackField.column + 1
                // else 
                    // get next fields:
                    // attackField.row + 1; -1
                    // attackField.column + 1, -1
                    // add to nextAttack
                
            // lastSuccessAttack = attackField;

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
    speech: {
        captainHit: "I see the bones of your ship splintering!",
        playerHit: "So, you've hit me. But you will not break me!",
        captainMiss: "A wasted blow! My bones will not break so easily!",
        playerMiss: "Pathetic! You can't pierce my bones that easily.",
        captainSink: "Your fleet is broken! Not even the living can defeat me!",
        playerSink: "My fleet... shattered... But I shall return to haunt you!",
        placeShips: "You have but one chance to prepare. The bones of fate have already begun their dance.",
        gameStart: "The bones are cast... now prepare for your doom!",
        captainWin: "Your defeat is inevitable, mortal. The bones always win!",
        playerWin: "No! My bones were unyielding... yet you've broken me. A temporary victory, human!"
    },
    getSpeech: getSpeech,
    attack: function(availableTargets) {
        // if (availableTargets.length == 0) return;

        // let attackField;

        // if nextAttack empty
            // let index = Math.floor(Math.random() * availableTargets.length);
            // attackField = availableTargets[index];
        // else 
            // attackField = nextAttack.shift();

        // await simulateClickAndObserve
            // setTimeout(() => {
            //     attackField.click();
            // }, 1200);   

        // availableTargets.splice(index, 1);
        
        // checkUpdatedField
        // if hit && nextAttack empty
            // let nextTargets = availableTargets.filter(field.ship === attackField.ship)
                // nextTargets.forEach if not attackField add to nextAttack

        
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
    }
};