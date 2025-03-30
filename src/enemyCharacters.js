import wraithmoorImg from './img/wraithmoor/wraithmoor.jpeg';
import ghost1 from './img/wraithmoor/ghost_1.png';
import ghost2 from './img/wraithmoor/ghost_2.png';
import ghost3 from './img/wraithmoor/ghost_3.png';
import ghost4 from './img/wraithmoor/ghost_4.png';
import ghost5 from './img/wraithmoor/ghost_5.png';

import grimhollowImg from './img/grimhollow/grimhollow.jpeg'
import zombie1 from './img/grimhollow/zombie_1.png';
import zombie2 from './img/grimhollow/zombie_2.png';
import zombie3 from './img/grimhollow/zombie_3.png';
import zombie4 from './img/grimhollow/zombie_4.png';
import zombie5 from './img/grimhollow/zombie_5.png';

import boneshardImg from './img/boneshard/boneshard.jpeg';
import skeleton1 from './img/boneshard/skeleton_1.png';
import skeleton2 from './img/boneshard/skeleton_2.png';
import skeleton3 from './img/boneshard/skeleton_3.png';
import skeleton4 from './img/boneshard/skeleton_4.png';
import skeleton5 from './img/boneshard/skeleton_5.png';

import human1 from './img/human/human_1.png';
import human2 from './img/human/human_2.png';
import human3 from './img/human/human_3.png';
import human4 from './img/human/human_4.png';
import human5 from './img/human/human_5.png';

export function getSpeech(character) {
    const randomIndex = Math.floor(Math.random() * character.speech.length);
    return character.speech[randomIndex];
};

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
            }, 10);  

            // Timeout to prevent infinite waiting
            setTimeout(() => {
                observer.disconnect();
                reject("Click event timed out: No class change detected.");
            }, 4000);
        } catch (error) {
            reject("Click event failed: " + error);
        }
    });
};

function getRandomIndex(availableTargets) {
    return Math.floor(Math.random() * availableTargets.length);
}

export const wraithmoor = {
    name: "Captain Wraithmoor",
    difficulty: "easy",
    speech: [
        "The fog rises once more... Your fate is sealed in the mist.",
        "You strike, but it will not matter. The fog will return to claim what is lost.",
        "The spirits of the deep stir. They whisper your doom through the fog.",
        "The mist thickens. Your every move is lost in its endless embrace.",
        "The fog does not forget, and neither will I. Your fate is but a fleeting moment in the mist.",
        "My ghostly fleet never truly fades. The fog will bring us back... always.",
        "Beware, mortal. The fog twists reality, and soon you'll be trapped within it.",
        "You may think you've gained ground, but the fog consumes all in the end.",
        "The fog has eyes, and it watches. It sees all, and so do I.",
        "You fight well, but the fog's grip is stronger. It will never let you go."
    ],
    getSpeech: getSpeech,
    attack: function(availableTargets) {
        if (availableTargets.length == 0) return;

        let index = getRandomIndex(availableTargets);
        let randomField = availableTargets[index];

        randomField.click();   

        availableTargets.splice(index, 1);
    },
    styling: {
        backGroundColorBoard: "var(--limeGreen)",  
        playerBoardBoxShadow: "4px 4px 15px 10px var(--limeGreen)",
        imageUrl: wraithmoorImg,
    },
    ships: {
        1: ghost1,
        2: ghost2,
        3: ghost3,
        4: ghost4,
        5: ghost5,
    }
}

export const grimhollow = {
    name: "Captain Grimhollow",
    difficulty: "medium",
    speech: [
        "The dead never rest. They rise, again and again, as the fog stirs.",
        "You may delay them, but the undead are eternal. The fog will see to it.",
        "The fog is thick with the restless souls. The dead shall always return.",
        "In the mist, the undead rise, relentless and unyielding. No one escapes their grasp.",
        "The dead are never truly gone. They wander, forever bound to the fog's will.",
        "You cannot escape the fog, nor the undead it brings. They will always find their way back.",
        "The undead rise from the depths, and with them, the fog. It is inevitable.",
        "The fog claims all, even the living. The dead are never far behind.",
        "Time means nothing to the undead. The fog carries them back, always.",
        "You may think you've overcome them, but the undead cannot be vanquished. The fog ensures it."
    ],
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
                        // check if attack direction is  not set
                        if (!this.attackDirection) {
                            let rowDiff = parseInt(attackField.dataset.row) - parseInt(this.lastSuccessfullAttack.dataset.row);
                            let colDiff = parseInt(attackField.dataset.column) - parseInt(this.lastSuccessfullAttack.dataset.column);

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
        playerBoardBoxShadow: "4px 4px 15px 10px var(--goldenYellow)",
        imageUrl: grimhollowImg,
    },
    ships: {
        1: zombie1,
        2: zombie2,
        3: zombie3,
        4: zombie4,
        5: zombie5,
    }
};

export const boneshard = {
    name: "Captain Boneshard",
    difficulty: "hard",
    speech: [
        "The bones of fate are cast. There is no escaping the inevitable.",
        "You may strike, but my bones are unyielding. I will always rise again.",
        "The bones are strong and unbroken. Nothing can shatter them... nothing.",
        "You may try, but the bones will not bend or break. The dance of fate is already set.",
        "The bones do not yield. The longer you fight, the closer you come to your doom.",
        "The bones never falter, they simply wait. And when the time comes, they will claim all.",
        "You cannot break what is already unbroken. The bones will endure as long as the fog lingers.",
        "The dance of bones has already begun. There is no escaping fate’s grasp.",
        "You may think you can defeat me, but the bones are eternal. Time cannot undo them.",
        "The bones will not break. They are a reminder that death is never far behind."
    ],
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
        playerBoardBoxShadow: "4px 4px 15px 10px var(--glowingOrange)",
        imageUrl: boneshardImg,
    },
    ships: {
        1: skeleton1,
        2: skeleton2,
        3: skeleton3,
        4: skeleton4,
        5: skeleton5,
    }
};

export const human = {
    styling: {
        backGroundColorBoard: "var(--electricBlue)",  
        playerBoardBoxShadow: "4px 4px 15px 10px var(--electricBlue)",
    },
    ships: {
        1: human1,
        2: human2,
        3: human3,
        4: human4,
        5: human5,
    }
};

export const characters = {
    wraithmoor: wraithmoor,
    grimhollow: grimhollow,
    boneshard: boneshard,
    human: human
}