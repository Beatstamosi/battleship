// TODO: Add attack functions to grimhollow and boneshard
function getSpeech(event) {
    return this.speech[event];
}

function simulateClickAndObserve(attackField) {
    return new Promise((resolve) => {
        // Create a MutationObserver to watch for changes in the attackField
        const observer = new MutationObserver((mutationsList, observer) => {
            // Check if the field has been updated with a "hit" or "missed" class
            if (attackField.classList.contains('hit')) {
                resolve("hit");
            } else if (attackField.classList.contains('missed')) {
                 resolve("missed");
            }
            observer.disconnect();
        });

        // Observe the field for class changes
        observer.observe(attackField, { attributes: true, childList: false, subtree: false });

        // Trigger the click event
        attackField.click();
    });
}

function getRandomIndex(availableTargets) {
    return Math.floor(Math.random() * availableTargets.length);
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

        let index = getRandomIndex(availableTargets);
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
    nextAttack: [],
    lastSuccessfullAttack: null,
    attack: async function(availableTargets) {
        if (availableTargets.length == 0) return;
    
        let attackField;
        let nextField;
    
        // attack patterns
        const getAttackLeft = (attackField, availableTargets) => {
            return availableTargets.find(item => 
                item.dataset.column === (attackField.dataset.column - 1) && 
                item.dataset.row == attackField.dataset.row
            );
        };
        const getAttackRight = (attackField, availableTargets) => {
            return availableTargets.find(item => 
                item.dataset.column === (attackField.dataset.column + 1) && 
                item.dataset.row == attackField.dataset.row
            );
        };
        const getAttackTop = (attackField, availableTargets) => {
            return availableTargets.find(item => 
                item.dataset.row === (attackField.dataset.row - 1) && 
                item.dataset.column == attackField.dataset.column
            );
        };
        const getAttackBottom = (attackField, availableTargets) => {
            return availableTargets.find(item => 
                item.dataset.row === (attackField.dataset.row + 1) && 
                item.dataset.column == attackField.dataset.column
            );
        };
    
        // start attack
        if (this.nextAttack.length == 0) {
            let index = getRandomIndex(availableTargets);
            attackField = availableTargets[index];
        } else {
            attackField = this.nextAttack.shift();
        }
    
        await simulateClickAndObserve(attackField)
        .then(result => {
            if (result === "hit") {
                this.nextAttack.length = 0;
    
                if (attackField.ship && !attackField.ship.sunk) {
                    // if second hit on ship, make sure it attacks along the row / column of the ship
                    if (this.lastSuccessfullAttack) {
                        if (attackField.dataset.row < this.lastSuccessfullAttack.dataset.row) {
                            nextField = getAttackTop(attackField, availableTargets);
                        } else if (attackField.dataset.row > this.lastSuccessfullAttack.dataset.row) {
                            nextField = getAttackBottom(attackField, availableTargets);
                        } else if (attackField.dataset.column < this.lastSuccessfullAttack.dataset.column) {
                            nextField = getAttackLeft(attackField, availableTargets);
                        } else if (attackField.dataset.column > this.lastSuccessfullAttack.dataset.column) {
                            nextField = getAttackRight(attackField, availableTargets);
                        }
    
                        if (nextField) this.nextAttack.push(nextField);
                    // if first hit on this ship, get surrounding fields as nextAttack
                    } else {
                        let attackTop = getAttackTop(attackField, availableTargets);
                        let attackBottom = getAttackBottom(attackField, availableTargets);
                        let attackLeft = getAttackLeft(attackField, availableTargets);
                        let attackRight = getAttackRight(attackField, availableTargets);
    
                        if (attackTop) this.nextAttack.push(attackTop);
                        if (attackBottom) this.nextAttack.push(attackBottom);
                        if (attackLeft) this.nextAttack.push(attackLeft);
                        if (attackRight) this.nextAttack.push(attackRight);
                    }
                }
            }
    
            this.lastSuccessfullAttack = attackField;
            availableTargets.splice(availableTargets.indexOf(attackField), 1);
        }).catch((error) => {
            console.error('Attack failed:', error);
        });
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
    nextAttack: [],
    lastSuccessfullAttack: null,
    attack: async function(availableTargets) {
        if (availableTargets.length === 0) return;
    
        let attackField;
    
        // If there are no next attacks, pick a random target from availableTargets
        if (this.nextAttack.length === 0) {
            let index = getRandomIndex(availableTargets);
            attackField = availableTargets[index];
        } else {
            // If there are next attacks, use the first one
            attackField = this.nextAttack.shift();
        }
    
        // Perform the attack
        await simulateClickAndObserve(attackField)
        .then(result => {
            // Remove attackField from availableTargets so we don't attack it again
            availableTargets.splice(availableTargets.indexOf(attackField), 1);
    
            // If it's a "hit", and there are no next attacks queued, look for other fields related to the same ship
            if (result === "hit" && this.nextAttack.length === 0) {
                let nextTargets = availableTargets.filter(field => field.ship && field.ship.length === attackField.ship.length);
                
                nextTargets.forEach(target => {
                    // Add these related targets to the next attacks queue
                    this.nextAttack.push(target);
                });
            }
        }).catch(error => {
            console.error("Error during attack:", error);
        });
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