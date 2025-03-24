function getSpeech(event) {
    return this.speech[event];
}

function simulateClickAndObserve(attackField) {
    return new Promise((resolve, reject) => {
        try {
            const observer = new MutationObserver((mutationsList, observer) => {
                if (attackField.classList.contains('hit')) {
                    resolve("hit");
                } else if (attackField.classList.contains('missed')) {
                    resolve("missed");
                }
                observer.disconnect();
            });

            // Observe after a short delay to ensure class changes happen
            setTimeout(() => {
                observer.observe(attackField, { attributes: true });
                attackField.click();
            }, 1000);  

            // Timeout to prevent infinite waiting
            setTimeout(() => {
                observer.disconnect();
                reject("Click event timed out: No class change detected.");
            }, 2000);
        } catch (error) {
            reject("Click event failed: " + error);
        }
    });
}

function getRandomIndex(availableTargets) {
    return Math.floor(Math.random() * availableTargets.length);
}

export const wraithmoor = {
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

export const grimhollow = {
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
    attackDirection: null,
    attack: async function(availableTargets) {
        if (availableTargets.length == 0) return;
    
        let attackField;

        // attack patterns
        const getAttackLeft = (attackField, availableTargets) => {
            return availableTargets.find(item => 
                parseInt(item.dataset.column) === parseInt(attackField.dataset.column) - 1 && 
                parseInt(item.dataset.row) == parseInt(attackField.dataset.row)
            );
        };
        const getAttackRight = (attackField, availableTargets) => {
            return availableTargets.find(item => 
                parseInt(item.dataset.column) === parseInt(attackField.dataset.column) + 1 && 
                parseInt(item.dataset.row) == parseInt(attackField.dataset.row)
            );
        };
        const getAttackTop = (attackField, availableTargets) => {
            return availableTargets.find(item => 
                parseInt(item.dataset.row) === parseInt(attackField.dataset.row) - 1 && 
                parseInt(item.dataset.column) == parseInt(attackField.dataset.column)
            );
        };
        const getAttackBottom = (attackField, availableTargets) => {
            return availableTargets.find(item => 
                parseInt(item.dataset.row) === parseInt(attackField.dataset.row) + 1 && 
                parseInt(item.dataset.column) == parseInt(attackField.dataset.column)
            );
        };
    
        if (this.nextAttack.length == 0) {
            let index = getRandomIndex(availableTargets);
            attackField = availableTargets[index];
        } else {
            attackField = this.nextAttack.shift();
        }
    
        let gameField = attackField.gameField; // Get the actual field data
    
        await simulateClickAndObserve(attackField)
        .then(result => {
            if (result == "hit") {
                // this.nextAttack.length = 0; // Clear queue
    
                if (gameField.ship && !gameField.ship.sunk) { 
                    if (this.lastSuccessfullAttack) {
                        let rowDiff = parseInt(attackField.dataset.row) - parseInt(this.lastSuccessfullAttack.dataset.row);
                        let colDiff = parseInt(attackField.dataset.column) - parseInt(this.lastSuccessfullAttack.dataset.column);

                        if (!this.attackDirection) {
                            // Determine attack direction after the second hit
                            if (rowDiff !== 0) {
                                this.attackDirection = "vertical";
                            } else if (colDiff !== 0) {
                                this.attackDirection = "horizontal";
                            }
                        }

                        // Continue attack in the determined direction
                        if (this.attackDirection === "vertical") {
                            let nextTop = getAttackTop(attackField, availableTargets);
                            let nextBottom = getAttackBottom(attackField, availableTargets);
                            if (nextTop) this.nextAttack.push(nextTop);
                            if (nextBottom) this.nextAttack.push(nextBottom);
                        } else if (this.attackDirection === "horizontal") {
                            let nextLeft = getAttackLeft(attackField, availableTargets);
                            let nextRight = getAttackRight(attackField, availableTargets);
                            if (nextLeft) this.nextAttack.push(nextLeft);
                            if (nextRight) this.nextAttack.push(nextRight);
                        }
                    } else {
                        // First hit: check all four directions
                        let attackTop = getAttackTop(attackField, availableTargets);
                        let attackBottom = getAttackBottom(attackField, availableTargets);
                        let attackLeft = getAttackLeft(attackField, availableTargets);
                        let attackRight = getAttackRight(attackField, availableTargets);
                    
                        if (attackTop) this.nextAttack.push(attackTop);
                        if (attackBottom) this.nextAttack.push(attackBottom);
                        if (attackLeft) this.nextAttack.push(attackLeft);
                        if (attackRight) this.nextAttack.push(attackRight);
                    }
                };

                if (gameField.ship && gameField.ship.sunk) {
                    this.lastSuccessfullAttack = null;
                    this.attackDirection = null;
                }  else {
                    this.lastSuccessfullAttack = attackField;
                }
            }
            availableTargets = availableTargets.filter(field => field !== attackField);
        }).catch(error => {
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

export const boneshard = {
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
    
        if (this.nextAttack.length === 0) {
            let index = getRandomIndex(availableTargets);
            attackField = availableTargets[index];
        } else {
            attackField = this.nextAttack.shift();
        }
    
        await simulateClickAndObserve(attackField)
        .then(result => {
            availableTargets.splice(availableTargets.indexOf(attackField), 1);
    
            let gameField = attackField.gameField; // Access the linked game field
    
            if (result === "hit" && gameField?.ship) {
                availableTargets = availableTargets.filter(field => field !== attackField);
                this.lastSuccessfullAttack = attackField;
                let nextTargets = availableTargets.filter(field => field.gameField?.ship && field.gameField.ship.length === gameField.ship.length);
                nextTargets.forEach(target => {
                    if (!this.nextAttack.includes(target)) {
                        this.nextAttack.push(target);
                    }
                });
                console.log("Last success attack:", this.lastSuccessfullAttack);
                console.log("Next Attack:", this.nextAttack);
            }
        }).catch(error => {
            console.error("Error during boneshard attack:", error);
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