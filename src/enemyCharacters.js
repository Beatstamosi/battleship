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
        // 1. Pre-attack validation
        if (attackField.classList.contains('hit') || 
            attackField.classList.contains('crossed-out')) {
            console.warn('Already hit:', attackField);
            return resolve("hit");
        }
        if (attackField.classList.contains('missed')) {
            return resolve("missed");
        }

        // 2. Verify clickability
        if (typeof attackField.click !== 'function' || 
            attackField.disabled || 
            attackField.style.pointerEvents === 'none') {
            console.warn('Field not clickable - resolving as miss');
            return resolve("missed"); // Treat as failed attack
        }

        // 3. Setup observer
        const observer = new MutationObserver(() => {
            if (attackField.classList.contains('hit') || 
                attackField.classList.contains('crossed-out')) {
                cleanup();
                resolve("hit");
            } 
            else if (attackField.classList.contains('missed')) {
                cleanup();
                resolve("missed");
            }
        });

        // 4. Cleanup function
        let timeoutId;
        const cleanup = () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };

        // 5. Start observing
        observer.observe(attackField, {
            attributes: true,
            attributeFilter: ['class']
        });

        // 6. Trigger click
        try {
            attackField.click();
        } catch (err) {
            cleanup();
            reject("Click failed: " + err);
            return;
        }

        // 7. Timeout fallback
        timeoutId = setTimeout(() => {
            cleanup();
            if (attackField.classList.contains('hit')) resolve("hit");
            else if (attackField.classList.contains('missed')) resolve("missed");
            else reject(`Timeout (classes: ${attackField.className})`);
        }, 3000);
    });
}

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
    attack: async function(availableTargets) {
        if (availableTargets.length == 0) return;
        
        let index = getRandomIndex(availableTargets);
        let field = availableTargets.splice(index, 1)[0];

        // 2. Validate field state
        if (field.classList.contains('hit') || field.classList.contains('missed')) {
            console.warn('Attempted to attack already-hit field');
            return;
        }
        
        // 3. Trigger click and handle potential errors
        try {
            field.click();
        } catch (error) {
            console.error('Click failed:', error);
            availableTargets.push(field); // Re-add if click failed
        }
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
    alreadyAttacked: [],
    hitCounter: 0,
    attack: async function(availableTargets) {
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

        // Filter out already-attacked fields FIRST
        availableTargets = availableTargets.filter(field => 
            !field.classList.contains('hit') &&
            !field.classList.contains('missed') &&
            !field.classList.contains('crossed-out')
        );

        if (availableTargets.length == 0) return;
    
        let attackField;
    
        // select attack target and filter nextAttack
        if (this.nextAttack.length == 0) {
            const index = getRandomIndex(availableTargets);
            attackField = availableTargets[index];

        } else {
            this.nextAttack = this.nextAttack.filter(field => 
                !field.classList.contains('hit') &&
                !field.classList.contains('missed') &&
                !field.classList.contains('crossed-out')
            );
            attackField = this.nextAttack.shift();
        }

        // Immediately remove from available targets AND add to alreadyAttacked
        this.alreadyAttacked.push(attackField);
        availableTargets = availableTargets.filter(field => field !== attackField);

    
        let gameField = attackField.gameField; // Get the actual field data
    
        try {
            const result =  await simulateClickAndObserve(attackField);

            if (result == "hit") {
                this.hitCounter += 1;
        
                if (this.hitCounter >= 2) { 
                    // reset next attacks
                    this.nextAttack.length = 0;

                    // add all fields with this ship as next attack
                    const nextTargets = availableTargets.filter(field => field.gameField?.ship && field.gameField.ship.length === gameField.ship.length &&
                        !this.alreadyAttacked.includes(field));

                    this.nextAttack.push(...nextTargets);
                } else {
                    // First hit: check all four directions
                    const adjacentTargets = [
                        getAttackTop(attackField, availableTargets),
                        getAttackBottom(attackField, availableTargets),
                        getAttackLeft(attackField, availableTargets),
                        getAttackRight(attackField, availableTargets),
                    ].filter(target => 
                        target && 
                        !target.classList.contains('hit') &&
                        !target.classList.contains('missed') &&
                        !target.classList.contains('crossed-out')
                    );
        
                    adjacentTargets.forEach(target => {
                        if (!this.nextAttack.includes(target) && !this.alreadyAttacked.includes(target)) {
                            this.nextAttack.push(target);
                        }
                    });
                }
            }
        
            if (gameField.ship && gameField.ship.sunk) {
                this.hitCounter = 0;
            }
        
            console.log({attackField});
            console.log(this.nextAttack);
        } catch (error) {
            console.error('Attack failed:', error);
        };
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
    attack: async function(availableTargets) {
        if (availableTargets.length === 0) return;

        let attackField;
    
        // get attack field
        attackField = this.nextAttack.length === 0 ? availableTargets[getRandomIndex(availableTargets)] : attackField = this.nextAttack.shift();
    
        // immediately remove from available Targets
        availableTargets.splice(availableTargets.indexOf(attackField), 1);

        // wait for attack
        let result = await simulateClickAndObserve(attackField);

        try {
            let gameField = attackField.gameField; // Access the linked game field
    
            if (result === "hit" && gameField?.ship) {

                let nextTargets = availableTargets.filter(field => field.gameField?.ship && field.gameField.ship.length === gameField.ship.length);
                nextTargets.forEach(target => {
                    if (!this.nextAttack.includes(target)) {
                        this.nextAttack.push(target);
                    }
                });
            }
        } catch(error) {
            console.error("Error during boneshard attack:", error);
        };
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