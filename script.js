// V-Bucks Clicker Game Logic
class VBucksClicker {
    constructor() {
        this.vbucks = 0;
        this.vbucksPerClick = 1;
        this.vbucksPerSecond = 0;
        this.clickMultiplier = 1;
        this.autoClickerActive = false;
        
        this.shopItems = this.generateShopItems();
        this.purchases = {};
        this.redeemedCodes = new Set();
        this.validCodes = this.generateValidCodes();
        
        this.init();
    }

    init() {
        this.bindEvents();
        // this.loadGame(); // Disabled loading
        this.startAutoClicker();
        this.renderShop();
        this.updateDisplay();
        this.initCodesSystem();
    }

    bindEvents() {
        const vbuckImage = document.getElementById('vbuck-image');
        vbuckImage.addEventListener('click', (e) => this.clickVBuck(e));
        vbuckImage.addEventListener('animationend', () => {
            vbuckImage.classList.remove('clicked');
        });
    }

    clickVBuck(event) {
        const vbuckImage = event.target;
        
        // Add click animation
        vbuckImage.classList.add('clicked');
        
        // Add V-Bucks
        const earnedVBucks = this.vbucksPerClick * this.clickMultiplier;
        this.vbucks += earnedVBucks;
        
        // Create click particle effect
        this.createClickParticle(event, earnedVBucks);
        
        // Update display
        this.updateDisplay();
        this.updateShopAffordability();
        // this.saveGame(); // Disabled saving
    }

    createClickParticle(event, amount) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = `+${this.formatNumber(amount)}`;
        
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        document.getElementById('click-particles').appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    startAutoClicker() {
        setInterval(() => {
            if (this.vbucksPerSecond > 0) {
                this.vbucks += this.vbucksPerSecond;
                this.updateDisplay();
                this.updateShopAffordability();
                
                // Show auto clicker hand if not already visible
                if (!this.autoClickerActive) {
                    this.autoClickerActive = true;
                    document.getElementById('auto-hand').classList.add('active');
                }
            } else if (this.autoClickerActive) {
                this.autoClickerActive = false;
                document.getElementById('auto-hand').classList.remove('active');
            }
            
            // this.saveGame(); // Disabled saving
        }, 1000);
    }

    updateDisplay() {
        document.getElementById('vbucks-count').textContent = this.formatNumber(this.vbucks);
        document.getElementById('vbucks-per-second').textContent = this.formatNumber(this.vbucksPerSecond);
        document.getElementById('vbucks-per-click').textContent = this.formatNumber(this.vbucksPerClick * this.clickMultiplier);
    }

    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return Math.floor(num).toString();
    }

    generateShopItems() {
        return [
            // Basic Upgrades (1-10)
            { id: 1, name: "Default Pickaxe", description: "Basic harvesting tool from spawn island", baseCost: 15, effect: 1, type: "click", maxLevel: 50 },
            { id: 2, name: "Bush Camper", description: "Hides and generates V-Bucks slowly", baseCost: 100, effect: 1, type: "auto", maxLevel: 25 },
            { id: 3, name: "Chest Finder", description: "Locate treasure chests for bonus V-Bucks", baseCost: 200, effect: 2, type: "click", maxLevel: 30 },
            { id: 4, name: "Storm Scout", description: "Predicts storm movement, generates steady income", baseCost: 500, effect: 3, type: "auto", maxLevel: 20 },
            { id: 5, name: "Llama Summoner", description: "Calls supply llamas for massive click bonuses", baseCost: 800, effect: 5, type: "click", maxLevel: 15 },
            { id: 6, name: "Victory Royale Bot", description: "Automated wins generate constant V-Bucks", baseCost: 1200, effect: 8, type: "auto", maxLevel: 10 },
            { id: 7, name: "Battle Bus Driver", description: "Drops more players, more V-Bucks per click", baseCost: 2000, effect: 12, type: "click", maxLevel: 12 },
            { id: 8, name: "Tilted Towers Manager", description: "Manages the chaos, steady V-Buck generation", baseCost: 3500, effect: 20, type: "auto", maxLevel: 8 },
            { id: 9, name: "Golden Scar Crafter", description: "Crafts legendary weapons for click multipliers", baseCost: 5000, effect: 25, type: "click", maxLevel: 10 },
            { id: 10, name: "Mythic Boss Slayer", description: "Defeats bosses automatically for huge rewards", baseCost: 8000, effect: 40, type: "auto", maxLevel: 5 },

            // Rare Upgrades (11-25)
            { id: 11, name: "Rift Generator", description: "Creates rifts that generate V-Bucks from other dimensions", baseCost: 12000, effect: 60, type: "auto", maxLevel: 8 },
            { id: 12, name: "Infinity Blade Wielder", description: "Wields the mythic blade for massive click damage", baseCost: 15000, effect: 80, type: "click", maxLevel: 6 },
            { id: 13, name: "Storm King Tamer", description: "Controls the Storm King for epic V-Buck generation", baseCost: 20000, effect: 120, type: "auto", maxLevel: 4 },
            { id: 14, name: "Zero Point Manipulator", description: "Harnesses Zero Point energy for reality-bending clicks", baseCost: 30000, effect: 200, type: "click", maxLevel: 5 },
            { id: 15, name: "Midas Touch", description: "Everything turned to gold generates massive wealth", baseCost: 45000, effect: 300, type: "auto", maxLevel: 3 },
            { id: 16, name: "Galactus Negotiator", description: "Strikes deals with cosmic entities", baseCost: 60000, effect: 500, type: "auto", maxLevel: 3 },
            { id: 17, name: "Foundation's Hammer", description: "The Seven's leader grants powerful click bonuses", baseCost: 80000, effect: 800, type: "click", maxLevel: 4 },
            { id: 18, name: "Cube Queen's Crown", description: "Rules over the cubes for dimensional V-Bucks", baseCost: 120000, effect: 1200, type: "auto", maxLevel: 2 },
            { id: 19, name: "IO Guard Captain", description: "Commands the entire IO force", baseCost: 180000, effect: 2000, type: "auto", maxLevel: 2 },
            { id: 20, name: "Paradigm's Mech", description: "Pilots the ultimate mech suit", baseCost: 250000, effect: 3500, type: "click", maxLevel: 3 },
            { id: 21, name: "Reality Tree Farmer", description: "Harvests reality seeds for infinite growth", baseCost: 350000, effect: 5000, type: "auto", maxLevel: 2 },
            { id: 22, name: "Chrome Infection", description: "Spreads chrome corruption for automated V-Bucks", baseCost: 500000, effect: 8000, type: "auto", maxLevel: 2 },
            { id: 23, name: "Kinetic Blade Master", description: "Masters the blade for devastating click combos", baseCost: 750000, effect: 15000, type: "click", maxLevel: 2 },
            { id: 24, name: "Fracture Controller", description: "Controls reality fractures across the multiverse", baseCost: 1000000, effect: 25000, type: "auto", maxLevel: 1 },
            { id: 25, name: "Omni-Sword Bearer", description: "Wields the sword that cuts through realities", baseCost: 1500000, effect: 50000, type: "click", maxLevel: 1 },

            // Epic Upgrades (26-50)
            { id: 26, name: "Fortnite Creator", description: "You ARE the game, ultimate control", baseCost: 2000000, effect: 100000, type: "auto", maxLevel: 1 },
            { id: 27, name: "Battle Pass Architect", description: "Designs endless Battle Passes", baseCost: 2500000, effect: 150000, type: "auto", maxLevel: 1 },
            { id: 28, name: "Vault Keeper", description: "Guards all vaulted items and their power", baseCost: 3000000, effect: 200000, type: "click", maxLevel: 1 },
            { id: 29, name: "Loop Master", description: "Controls the endless time loop of the island", baseCost: 4000000, effect: 300000, type: "auto", maxLevel: 1 },
            { id: 30, name: "Multiverse Hopper", description: "Travels between all Fortnite realities", baseCost: 5000000, effect: 500000, type: "auto", maxLevel: 1 },

            // Skin & Cosmetic Upgrades (31-60)
            { id: 31, name: "Peely Plantation", description: "Infinite banana people generate V-Bucks", baseCost: 25000, effect: 400, type: "auto", maxLevel: 5 },
            { id: 32, name: "Fishstick School", description: "Teaches fish to click for you", baseCost: 35000, effect: 600, type: "click", maxLevel: 4 },
            { id: 33, name: "Meowscles Gym", description: "Buff cat provides muscle-powered generation", baseCost: 50000, effect: 800, type: "auto", maxLevel: 3 },
            { id: 34, name: "Jonesy Multiverse", description: "All Jonesy variants click simultaneously", baseCost: 75000, effect: 1500, type: "click", maxLevel: 3 },
            { id: 35, name: "Raven's Dark Arts", description: "Summons dark energy for V-Buck generation", baseCost: 100000, effect: 2000, type: "auto", maxLevel: 2 },
            { id: 36, name: "Drift's Rift Energy", description: "Channels interdimensional click power", baseCost: 140000, effect: 3000, type: "click", maxLevel: 2 },
            { id: 37, name: "Lynx Tech Suit", description: "Advanced cybernetics automate V-Buck farming", baseCost: 200000, effect: 4500, type: "auto", maxLevel: 2 },
            { id: 38, name: "Ice King's Frozen Realm", description: "Eternal winter preserves V-Bucks forever", baseCost: 300000, effect: 7000, type: "auto", maxLevel: 1 },
            { id: 39, name: "Blackheart's Pirate Fleet", description: "Raids the seven seas for treasure", baseCost: 450000, effect: 12000, type: "click", maxLevel: 1 },
            { id: 40, name: "Ultima Knight's Honor", description: "Legendary knight's code multiplies all gains", baseCost: 600000, effect: 20000, type: "auto", maxLevel: 1 },

            // Weapon & Item Upgrades (41-70)
            { id: 41, name: "Boogie Bomb Factory", description: "Forces everyone to dance and drop V-Bucks", baseCost: 5000, effect: 15, type: "click", maxLevel: 8 },
            { id: 42, name: "Shockwave Grenade Plant", description: "Explosive growth of V-Buck generation", baseCost: 8500, effect: 25, type: "auto", maxLevel: 6 },
            { id: 43, name: "Grappler Assembly Line", description: "Mass produces grapplers for efficiency", baseCost: 15000, effect: 45, type: "auto", maxLevel: 5 },
            { id: 44, name: "Rocket Launcher Depot", description: "Explosive clicking power", baseCost: 25000, effect: 80, type: "click", maxLevel: 4 },
            { id: 45, name: "Chug Jug Brewery", description: "Infinite healing creates infinite wealth", baseCost: 40000, effect: 150, type: "auto", maxLevel: 3 },
            { id: 46, name: "Launch Pad Network", description: "Global transportation system generates fees", baseCost: 70000, effect: 300, type: "auto", maxLevel: 3 },
            { id: 47, name: "Port-a-Fort Empire", description: "Instant buildings create instant profits", baseCost: 120000, effect: 600, type: "click", maxLevel: 2 },
            { id: 48, name: "Rift-to-Go Monopoly", description: "Controls all dimensional travel", baseCost: 200000, effect: 1200, type: "auto", maxLevel: 2 },
            { id: 49, name: "Shadow Stone Mine", description: "Extracts ghostly power for ethereal clicks", baseCost: 350000, effect: 2500, type: "click", maxLevel: 1 },
            { id: 50, name: "Infinity Stone Collection", description: "Harnesses the power of infinity", baseCost: 600000, effect: 5000, type: "auto", maxLevel: 1 },

            // Location-Based Upgrades (51-80)
            { id: 51, name: "Tilted Towers Landlord", description: "Owns the most popular drop location", baseCost: 10000, effect: 30, type: "auto", maxLevel: 10 },
            { id: 52, name: "Retail Row Manager", description: "Manages the shopping district profits", baseCost: 18000, effect: 50, type: "auto", maxLevel: 8 },
            { id: 53, name: "Pleasant Park Mayor", description: "Suburban leadership generates steady income", baseCost: 30000, effect: 80, type: "auto", maxLevel: 6 },
            { id: 54, name: "Salty Springs Monopoly", description: "Controls the salt trade empire", baseCost: 50000, effect: 140, type: "auto", maxLevel: 5 },
            { id: 55, name: "Lazy Lake Resort Owner", description: "Luxury vacation destination profits", baseCost: 85000, effect: 250, type: "auto", maxLevel: 4 },
            { id: 56, name: "Misty Meadows Farmer", description: "Agricultural empire spans the meadows", baseCost: 150000, effect: 450, type: "auto", maxLevel: 3 },
            { id: 57, name: "Catty Corner Boss", description: "Controls the gas station empire", baseCost: 250000, effect: 800, type: "auto", maxLevel: 2 },
            { id: 58, name: "The Authority Director", description: "Commands the central intelligence", baseCost: 400000, effect: 1500, type: "auto", maxLevel: 2 },
            { id: 59, name: "Stark Industries CEO", description: "Runs Tony Stark's tech empire", baseCost: 700000, effect: 3000, type: "auto", maxLevel: 1 },
            { id: 60, name: "Apollo Island God", description: "Divine control over the entire island", baseCost: 1200000, effect: 6000, type: "auto", maxLevel: 1 },

            // Vehicle & Transportation (61-85)
            { id: 61, name: "Shopping Cart Empire", description: "The humble beginning of vehicle mastery", baseCost: 3000, effect: 8, type: "click", maxLevel: 15 },
            { id: 62, name: "ATK Racing League", description: "All-terrain kart racing generates profits", baseCost: 6000, effect: 15, type: "auto", maxLevel: 10 },
            { id: 63, name: "Quadcrasher Fleet", description: "Destructive vehicles create chaos profits", baseCost: 12000, effect: 30, type: "click", maxLevel: 8 },
            { id: 64, name: "Biplane Air Force", description: "Sky dominance through aerial superiority", baseCost: 25000, effect: 60, type: "auto", maxLevel: 6 },
            { id: 65, name: "Motorboat Navy", description: "Naval fleet controls the waterways", baseCost: 45000, effect: 120, type: "auto", maxLevel: 5 },
            { id: 66, name: "Helicopter Squadron", description: "Airborne transportation monopoly", baseCost: 80000, effect: 250, type: "click", maxLevel: 4 },
            { id: 67, name: "UFO Invasion Fleet", description: "Alien technology generates otherworldly V-Bucks", baseCost: 150000, effect: 500, type: "auto", maxLevel: 3 },
            { id: 68, name: "Mech Manufacturing", description: "Giant robots patrol and protect", baseCost: 300000, effect: 1000, type: "auto", maxLevel: 2 },
            { id: 69, name: "Battle Bus Airlines", description: "The ultimate transportation empire", baseCost: 600000, effect: 2500, type: "click", maxLevel: 1 },
            { id: 70, name: "Reality Transport Hub", description: "Controls all movement across realities", baseCost: 1000000, effect: 5000, type: "auto", maxLevel: 1 },

            // Seasonal & Event Upgrades (71-90)
            { id: 71, name: "Halloween Candy Factory", description: "Fortnitemares generates spooky profits", baseCost: 20000, effect: 50, type: "auto", maxLevel: 5 },
            { id: 72, name: "Christmas Present Workshop", description: "Winterfest joy creates V-Buck presents", baseCost: 35000, effect: 90, type: "click", maxLevel: 4 },
            { id: 73, name: "Summer Splash Park", description: "Beach party vibes generate sunny income", baseCost: 60000, effect: 180, type: "auto", maxLevel: 3 },
            { id: 74, name: "Love & War Cupid", description: "Valentine's romance multiplies everything", baseCost: 100000, effect: 350, type: "click", maxLevel: 2 },
            { id: 75, name: "Birthday Cake Empire", description: "Eternal celebration of Fortnite's birthday", baseCost: 180000, effect: 700, type: "auto", maxLevel: 2 },
            { id: 76, name: "Travis Scott Concert", description: "Astronomical music event draws infinite crowds", baseCost: 350000, effect: 1500, type: "auto", maxLevel: 1 },
            { id: 77, name: "Ariana Grande Rift Tour", description: "Musical dimensions generate harmonic V-Bucks", baseCost: 500000, effect: 2500, type: "click", maxLevel: 1 },
            { id: 78, name: "Marvel Nexus War", description: "Superhero conflicts create comic book profits", baseCost: 750000, effect: 4000, type: "auto", maxLevel: 1 },
            { id: 79, name: "Star Wars Galactic Empire", description: "The Force generates V-Bucks across galaxies", baseCost: 1200000, effect: 7500, type: "auto", maxLevel: 1 },
            { id: 80, name: "Dragon Ball Tournament", description: "Saiyan power levels generate infinite energy", baseCost: 2000000, effect: 15000, type: "click", maxLevel: 1 },

            // Meta & Game Mechanics (81-100)
            { id: 81, name: "Building Simulator", description: "Infinite materials create construction empire", baseCost: 15000, effect: 40, type: "auto", maxLevel: 6 },
            { id: 82, name: "Edit Course Master", description: "Perfect edits generate style points", baseCost: 30000, effect: 75, type: "click", maxLevel: 5 },
            { id: 83, name: "Zone Controller", description: "Manipulates storm circles for strategic advantage", baseCost: 60000, effect: 150, type: "auto", maxLevel: 4 },
            { id: 84, name: "Emote Dance Studio", description: "Choreographs viral dances for royalties", baseCost: 120000, effect: 300, type: "click", maxLevel: 3 },
            { id: 85, name: "Creative Mode God", description: "Infinite creation power generates endless content", baseCost: 250000, effect: 700, type: "auto", maxLevel: 2 },
            { id: 86, name: "Tournament Organizer", description: "Hosts global competitions for massive profits", baseCost: 500000, effect: 1500, type: "auto", maxLevel: 2 },
            { id: 87, name: "Streamer Influencer", description: "Millions of viewers generate ad revenue", baseCost: 1000000, effect: 4000, type: "click", maxLevel: 1 },
            { id: 88, name: "Esports League Owner", description: "Professional gaming empire spans the globe", baseCost: 2000000, effect: 8000, type: "auto", maxLevel: 1 },
            { id: 89, name: "Game Engine Hacker", description: "Manipulates the source code itself", baseCost: 4000000, effect: 20000, type: "click", maxLevel: 1 },
            { id: 90, name: "Metaverse Architect", description: "Designs the future of virtual worlds", baseCost: 8000000, effect: 50000, type: "auto", maxLevel: 1 },

            // Ultimate Godlike Upgrades (91-100)
            { id: 91, name: "Epic Games Founder", description: "You literally created Fortnite", baseCost: 10000000, effect: 100000, type: "auto", maxLevel: 1 },
            { id: 92, name: "Unreal Engine Master", description: "Controls the very engine that powers reality", baseCost: 20000000, effect: 250000, type: "auto", maxLevel: 1 },
            { id: 93, name: "Digital Universe Creator", description: "Codes entire universes into existence", baseCost: 50000000, effect: 500000, type: "click", maxLevel: 1 },
            { id: 94, name: "Quantum Reality Manipulator", description: "Exists in all possible Fortnite timelines", baseCost: 100000000, effect: 1000000, type: "auto", maxLevel: 1 },
            { id: 95, name: "Infinity Loop Breaker", description: "Transcends the endless battle royale cycle", baseCost: 250000000, effect: 2500000, type: "auto", maxLevel: 1 },
            { id: 96, name: "Conceptual V-Buck", description: "You ARE the concept of V-Bucks", baseCost: 500000000, effect: 5000000, type: "click", maxLevel: 1 },
            { id: 97, name: "Player Consciousness", description: "Merges with all player minds simultaneously", baseCost: 1000000000, effect: 10000000, type: "auto", maxLevel: 1 },
            { id: 98, name: "Gaming Singularity", description: "Becomes the ultimate convergence of all games", baseCost: 2500000000, effect: 25000000, type: "auto", maxLevel: 1 },
            { id: 99, name: "Reality.exe Administrator", description: "Has admin privileges over existence itself", baseCost: 5000000000, effect: 50000000, type: "click", maxLevel: 1 },
            { id: 100, name: "∞ V-BUCK TRANSCENDENCE ∞", description: "Transcends mathematics, logic, and comprehension", baseCost: 10000000000, effect: 100000000, type: "auto", maxLevel: 1 }
        ];
    }

    renderShop() {
        const shopContent = document.getElementById('shop-content');
        shopContent.innerHTML = '';

        this.shopItems.forEach(item => {
            const level = this.purchases[item.id] || 0;
            const cost = this.calculateCost(item.baseCost, level);
            const isMaxed = level >= item.maxLevel;
            const canAfford = this.vbucks >= cost && !isMaxed;

            const shopItem = document.createElement('div');
            shopItem.className = `shop-item ${canAfford ? 'affordable' : ''} ${isMaxed ? 'maxed' : ''}`;
            
            const effectText = item.type === 'click' ? 
                `+${this.formatNumber(item.effect * (level + 1))} per click` : 
                `+${this.formatNumber(item.effect * (level + 1))} per second`;

            shopItem.innerHTML = `
                <div class="item-header">
                    <span class="item-name">${item.name}</span>
                    <span class="item-level">Level ${level}${isMaxed ? ' (MAX)' : ''}</span>
                </div>
                <div class="item-description">${item.description}</div>
                <div class="item-stats">
                    <span class="item-cost">${isMaxed ? 'MAXED' : this.formatNumber(cost) + ' V-Bucks'}</span>
                    <span class="item-effect">${effectText}</span>
                </div>
            `;

            if (!isMaxed) {
                shopItem.addEventListener('click', (event) => this.purchaseItem(item, event));
            }

            shopContent.appendChild(shopItem);
        });
    }

    calculateCost(baseCost, level) {
        return Math.floor(baseCost * Math.pow(1.15, level));
    }

    purchaseItem(item, event) {
        const level = this.purchases[item.id] || 0;
        const cost = this.calculateCost(item.baseCost, level);

        if (this.vbucks >= cost && level < item.maxLevel) {
            this.vbucks -= cost;
            this.purchases[item.id] = level + 1;

            // Apply the effect
            if (item.type === 'click') {
                this.vbucksPerClick += item.effect;
            } else {
                this.vbucksPerSecond += item.effect;
            }

            // Visual feedback
            const shopItem = event.target.closest('.shop-item');
            if (shopItem) {
                shopItem.classList.add('purchased');
            }

            this.updateDisplay();
            this.renderShop();
            // this.saveGame(); // Disabled saving
        }
    }

    updateShopAffordability() {
        const shopItems = document.querySelectorAll('.shop-item');
        shopItems.forEach((element, index) => {
            const item = this.shopItems[index];
            const level = this.purchases[item.id] || 0;
            const cost = this.calculateCost(item.baseCost, level);
            const isMaxed = level >= item.maxLevel;
            const canAfford = this.vbucks >= cost && !isMaxed;

            element.className = `shop-item ${canAfford ? 'affordable' : ''} ${isMaxed ? 'maxed' : ''}`;
        });
    }

    saveGame() {
        // Saving disabled - game progress will not persist between sessions
        /*
        const gameData = {
            vbucks: this.vbucks,
            vbucksPerClick: this.vbucksPerClick,
            vbucksPerSecond: this.vbucksPerSecond,
            clickMultiplier: this.clickMultiplier,
            purchases: this.purchases,
            redeemedCodes: Array.from(this.redeemedCodes)
        };
        localStorage.setItem('vbucksClickerSave', JSON.stringify(gameData));
        */
    }

    loadGame() {
        // Loading disabled - game will always start fresh
        /*
        const savedData = localStorage.getItem('vbucksClickerSave');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            this.vbucks = gameData.vbucks || 0;
            this.vbucksPerClick = gameData.vbucksPerClick || 1;
            this.vbucksPerSecond = gameData.vbucksPerSecond || 0;
            this.clickMultiplier = gameData.clickMultiplier || 1;
            this.purchases = gameData.purchases || {};
            this.redeemedCodes = new Set(gameData.redeemedCodes || []);
        }
        */
    }

    // Codes System Methods
    generateValidCodes() {
        const codes = {};
        
        // Basic Codes (1-100 V-Bucks) - Easy to Medium
        const basicCodes = [
            "FORTNITE2024", "VBUCKS100", "BATTLEPASS", "VICTORYROY", "TILTED123",
            "PLEASANT99", "SALTY456", "RETAIL789", "LAZY321", "SWEATY654",
            "PEELY123", "FISHSTICK", "MEOWSCLES", "SKYE2020", "MIDAS999",
            "CATALYST77", "DRIFT888", "LYNX999", "RAGNAROK1", "OMEGA123",
            "CARBIDE99", "VISITOR42", "SCIENTIST", "PARADIGM7", "JOHN343",
            "FOUNDATION", "ORIGIN666", "IMAGINED8", "ORDER444", "SEVEN777",
            "CUBE123", "KEVIN999", "STORM456", "ZERO789", "POINT321",
            "ATHENA99", "APOLLO88", "ARTEMIS7", "CHAPTER1", "CHAPTER2",
            "CHAPTER3", "CHAPTER4", "SEASON1", "SEASON2", "SEASON3",
            "GALACTUS", "THANOS99", "BATMAN88", "SUPERMAN", "SPIDERMAN",
            "IRONMAN99", "HULK123", "THOR456", "LOKI789", "VENOM321",
            "CARNAGE99", "GROOT123", "ROCKET88", "GAMORA99", "STARLORD",
            "DEADPOOL", "CABLE123", "DOMINO99", "PSYLOCKE", "WOLVERINE",
            "STORM123", "MYSTIQUE", "RAVEN456", "BEAST789", "CYCLOPS99",
            "PHOENIX88", "ICEMAN99", "ANGEL123", "ROGUE456", "GAMBIT789",
            "JUBILEE99", "COLOSSUS", "KITTY123", "NIGHTCRA", "MAGIK456",
            "DAZZLER99", "PSYLOCKE", "BISHOP123", "CABLE999", "WARPATH88",
            "SUNSPOT", "CANNONBA", "MAGMA123", "BOOM456", "TABITHA99",
            "RICTOR88", "SHATTER", "SIRYN123", "BANSHEE4", "FORGE789",
            "DARWIN99", "DUST123", "ROCKSLID", "ANOLE456", "PIXIE789",
            "ARMOR99", "GENTLE88", "INDRA123", "LILA456", "TRANSONIC",
            "VELOCIDAD", "HOPE123", "LAURIE99", "TRANCE88", "MERCURY12"
        ];

        // Medium Codes (500-5000 V-Bucks)
        const mediumCodes = [
            "EPIC4839472", "GAMES38472", "UNREAL9384", "ENGINE4857", "CREATOR384",
            "BUILD4857", "EDIT93847", "ZONE48573", "STORM8374", "CIRCLE937",
            "LOOT84739", "CHEST4857", "AMMO93847", "SHIELD485", "SLURP9384",
            "CHUG48573", "BANDAGE93", "MEDKIT485", "APPLE9384", "MUSHROOM4",
            "CAMPFIRE9", "COZY48573", "LAUNCH938", "BOUNCE485", "JUMP93847",
            "GRAPPLER4", "SHOCKWAVE", "IMPULSE48", "BOOGIE938", "STINK4857",
            "SMOKE9384", "DECOY4857", "HOLOGRAM9", "SHADOW485", "CHROME938",
            "KINETIC48", "REALITY93", "FRACTURE4", "NEXUS9384", "QUANTUM48",
            "COSMIC938", "STELLAR48", "GALACTIC9", "UNIVERSAL", "INFINITE4",
            "ETERNAL93", "IMMORTAL4", "DIVINE938", "SACRED485", "HOLY93847"
        ];

        // Hard Codes (10000-50000 V-Bucks) - Very Hard
        const hardCodes = [
            "X9Y7Z4A2B8C6D1E5F3G9H7I2J8K4L6M1N5O3P9Q7R2S8T4U6V1W5X3Y9Z7A2",
            "Z8X6C4V2B9N7M5K3J1H9G7F5D3S2A1Q9W8E6R4T7Y5U3I8O6P1L9K7J5H3G1",
            "Q3W8E5R2T7Y4U9I1O6P0A8S5D2F7G9H4J6K3L1Z9X7C5V8B2N1M4Q6W3E8R5",
            "M9N4B7V2C8X1Z6Q3W5E8R2T9Y7U4I1O6P0A3S8D5F2G9H7J4K6L1M8N5B2V7",
            "P7L3K9J5H2G8F4D1S6A9Q2W5E8R3T7Y9U4I1O6P2L8K5J3H9G7F2D8S4A1Q6",
            "F4G9H2J8K5L1M6N3B7V4C8X2Z6Q9W3E5R8T2Y7U4I9O1P6A3S8D5F2G9H7J4",
            "I8O2P6A9S4D1F7G3H8J5K2L9M6N4B7V1C8X5Z2Q9W6E3R8T5Y2U7I4O1P6A9",
            "D5F8G2H7J4K9L1M6N3B8V5C2X9Z6Q4W7E1R8T5Y2U9I6O3P7A4S1D8F5G2H9",
            "J7K4L1M8N5B9V2C6X3Z8Q5W2E9R6T4Y7U1I8O5P2A9S6D3F8G5H2J9K6L3M1",
            "N4B8V5C2X9Z6Q3W7E4R1T8Y5U2I9O6P3A7S4D1F8G5H2J9K6L3M8N5B2V9C6"
        ];

        // Legendary Codes (100000+ V-Bucks) - Extremely Hard
        const legendaryCodes = [
            "OMEGA99ALPHA77BETA55GAMMA33DELTA11EPSILON88ZETA66THETA44IOTA22KAPPA",
            "INFINITYSTONE4739TIMESTONE8362SPACESTONE9174REALITYSTONE5283POWER",
            "QUANTUMREALM9384MULTIVERSE7162NEXUSPOINT5948TIMELOOP3716PARADOX82",
            "ZEROPOINT4857APOLLOISLAND9384ATHENAMAP7162ARTEMIS5948CHAPTER4TAB3",
            "FOUNDATIONARMOR9999ORIGINSKIN8888IMAGINEDSTYLE7777ORDERMASK6666SI",
            "X4Y8Z2A6B1C5D9E3F7G2H8I4J6K1L5M9N3O7P2Q8R4S6T1U5V9W3X7Y2Z8A4",
            "GALACTUSPOWER8888STORMKINGMIGHT7777CUBEQUEEN6666ICEKINGFROST5555",
            "MYTHICBOSSRAID9999LEGENDARYWEAPON8888EPICVICTORY7777RARETRIUMPH66",
            "UNIVERSALCONSTANT4857COSMICENERGY9384STELLARPOWER7162GALACTICFOR",
            "TRANSCENDENCE9999ENLIGHTENMENT8888OMNIPOTENCE7777OMNISCIENCE6666"
        ];

        // Add basic codes (50-500 V-Bucks)
        basicCodes.forEach((code, index) => {
            codes[code] = {
                reward: Math.floor(Math.random() * 450) + 50, // 50-500 V-Bucks
                type: 'vbucks',
                description: 'Basic V-Bucks reward'
            };
        });

        // Add medium codes (1000-10000 V-Bucks)
        mediumCodes.forEach((code, index) => {
            codes[code] = {
                reward: Math.floor(Math.random() * 9000) + 1000, // 1000-10000 V-Bucks
                type: 'vbucks',
                description: 'Medium V-Bucks reward'
            };
        });

        // Add hard codes (20000-100000 V-Bucks)
        hardCodes.forEach((code, index) => {
            codes[code] = {
                reward: Math.floor(Math.random() * 80000) + 20000, // 20000-100000 V-Bucks
                type: 'vbucks',
                description: 'Hard V-Bucks reward'
            };
        });

        // Add legendary codes (250000-1000000 V-Bucks)
        legendaryCodes.forEach((code, index) => {
            codes[code] = {
                reward: Math.floor(Math.random() * 750000) + 250000, // 250000-1000000 V-Bucks
                type: 'vbucks',
                description: 'Legendary V-Bucks reward'
            };
        });

        // Special multiplier codes
        const multiplierCodes = [
            "MULTIPLIER2X", "DOUBLE999", "TRIPLE777", "QUAD555", "PENTA333",
            "HEXA111", "MEGA999", "ULTRA777", "SUPER555", "HYPER333"
        ];

        multiplierCodes.forEach((code, index) => {
            codes[code] = {
                reward: index + 2, // 2x to 11x multiplier
                type: 'multiplier',
                description: `${index + 2}x click multiplier for 5 minutes`
            };
        });

        // Auto-clicker boost codes
        const autoBoostCodes = [
            "AUTOBOOST1", "AUTOBOOST2", "AUTOBOOST3", "AUTOBOOST4", "AUTOBOOST5",
            "SPEEDUP99", "TURBO777", "NITRO555", "BOOST333", "ACCELERATE"
        ];

        autoBoostCodes.forEach((code, index) => {
            codes[code] = {
                reward: (index + 1) * 100, // 100-1000 V-Bucks per second for 10 minutes
                type: 'autoboost',
                description: `+${(index + 1) * 100} V-Bucks per second for 10 minutes`
            };
        });

        // Generate additional random hard codes to reach 500 total
        const totalGenerated = basicCodes.length + mediumCodes.length + hardCodes.length + 
                              legendaryCodes.length + multiplierCodes.length + autoBoostCodes.length;
        const remaining = 500 - totalGenerated;

        for (let i = 0; i < remaining; i++) {
            // Generate super hard random codes
            let randomCode = '';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (let j = 0; j < 25; j++) {
                randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            const rewardType = Math.random();
            if (rewardType < 0.7) {
                codes[randomCode] = {
                    reward: Math.floor(Math.random() * 50000) + 5000,
                    type: 'vbucks',
                    description: 'Random V-Bucks reward'
                };
            } else if (rewardType < 0.9) {
                codes[randomCode] = {
                    reward: Math.floor(Math.random() * 5) + 2,
                    type: 'multiplier',
                    description: `${Math.floor(Math.random() * 5) + 2}x click multiplier for 3 minutes`
                };
            } else {
                codes[randomCode] = {
                    reward: Math.floor(Math.random() * 500) + 100,
                    type: 'autoboost',
                    description: `+${Math.floor(Math.random() * 500) + 100} V-Bucks per second for 5 minutes`
                };
            }
        }

        return codes;
    }

    initCodesSystem() {
        const codesButton = document.getElementById('codes-button');
        const modal = document.getElementById('codes-modal');
        const closeButton = document.getElementById('close-modal');
        const codeInput = document.getElementById('code-input');
        const redeemButton = document.getElementById('redeem-button');
        const keypadButtons = document.querySelectorAll('.key-btn');

        // Open modal
        codesButton.addEventListener('click', () => {
            modal.classList.add('active');
            codeInput.value = '';
        });

        // Close modal
        closeButton.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close modal on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Keypad functionality
        keypadButtons.forEach(button => {
            button.addEventListener('click', () => {
                const key = button.dataset.key;
                const currentValue = codeInput.value;

                if (key === 'clear') {
                    codeInput.value = '';
                } else if (key === 'backspace') {
                    codeInput.value = currentValue.slice(0, -1);
                } else if (currentValue.length < 70) {
                    codeInput.value = currentValue + key;
                }
            });
        });

        // Allow keyboard input - both letters and numbers
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;

            // Allow letters A-Z
            if (e.key >= 'a' && e.key <= 'z') {
                if (codeInput.value.length < 70) {
                    codeInput.value += e.key.toUpperCase();
                }
            } else if (e.key >= 'A' && e.key <= 'Z') {
                if (codeInput.value.length < 70) {
                    codeInput.value += e.key;
                }
            }
            // Allow numbers 0-9
            else if (e.key >= '0' && e.key <= '9') {
                if (codeInput.value.length < 70) {
                    codeInput.value += e.key;
                }
            } else if (e.key === 'Backspace') {
                codeInput.value = codeInput.value.slice(0, -1);
            } else if (e.key === 'Enter') {
                this.redeemCode();
            } else if (e.key === 'Escape') {
                modal.classList.remove('active');
            }
        });

        // Redeem button
        redeemButton.addEventListener('click', () => {
            this.redeemCode();
        });
    }

    redeemCode() {
        const codeInput = document.getElementById('code-input');
        const code = codeInput.value.toUpperCase().trim();

        if (!code) {
            this.showNotification('Please enter a code!', 'error');
            return;
        }

        if (this.redeemedCodes.has(code)) {
            this.showNotification('Code already redeemed!', 'error');
            return;
        }

        if (this.validCodes[code]) {
            const codeData = this.validCodes[code];
            this.redeemedCodes.add(code);

            if (codeData.type === 'vbucks') {
                this.vbucks += codeData.reward;
                this.showNotification(`Code redeemed! +${this.formatNumber(codeData.reward)} V-Bucks!`, 'success');
            } else if (codeData.type === 'multiplier') {
                this.clickMultiplier *= codeData.reward;
                setTimeout(() => {
                    this.clickMultiplier /= codeData.reward;
                    this.updateDisplay();
                }, 300000); // 5 minutes
                this.showNotification(`Code redeemed! ${codeData.reward}x click multiplier for 5 minutes!`, 'success');
            } else if (codeData.type === 'autoboost') {
                this.vbucksPerSecond += codeData.reward;
                setTimeout(() => {
                    this.vbucksPerSecond -= codeData.reward;
                    this.updateDisplay();
                }, 600000); // 10 minutes
                this.showNotification(`Code redeemed! +${codeData.reward} V-Bucks/sec for 10 minutes!`, 'success');
            }

            this.updateDisplay();
            // this.saveGame(); // Disabled saving
            document.getElementById('codes-modal').classList.remove('active');
            codeInput.value = '';
        } else {
            this.showNotification('Invalid code!', 'error');
        }
    }

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        const icon = notification.querySelector('.notification-icon');
        const text = notification.querySelector('.notification-text');

        // Set content
        text.textContent = message;
        
        if (type === 'success') {
            icon.textContent = '✅';
            notification.className = 'notification success';
        } else {
            icon.textContent = '❌';
            notification.className = 'notification error';
        }

        // Show notification
        notification.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VBucksClicker();
});