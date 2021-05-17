let GameState = {
    preload: function() {
        this.load.image('background', 'assets/img/bg.png')
        this.load.image('arrow','assets/img/arrow.png')

        this.load.image('iguro','assets/img/iguro.png')
        this.load.image('inosuke','assets/img/inosuke.png')
        this.load.image('nezuko','assets/img/nezuko.png')
        this.load.image('shinazugawa','assets/img/shinazugawa.png')
        this.load.image('shinobu','assets/img/shinobu.png')
        this.load.image('tanjiro','assets/img/tanjiro.png')
        this.load.image('tokito','assets/img/tokito.png')
        this.load.image('tomioka','assets/img/tomioka.png')
        this.load.image('zenitsu','assets/img/zenistu.png')

        this.load.audio('bg-music','assets/audio/bg-music.mp3')
    },

    create: function() {
        this.background = this.game.add.sprite(0,0,'background')
    
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        this.scale.pageAlignHorizontally = true
        this.scale.pageAlignVertically = true

        let style = {
            font: 'bold 50pt',
            fill: 'white',
            align: 'center'
        }

        this.nameText = this.game.add.text(this.game.width/2, this.game.height*0.9, '鬼滅の刃', style)
        this.nameText.anchor.setTo(0.5, 0.5)
        
        this.game.input.onDown.addOnce(() => {
            this.game.sound.context.resume()
        })

        this.backgroundSound = game.add.audio('bg-music')
        // this.backgroundSound.play()
        this.backgroundSound.volume = 0.4
        this.backgroundSound.loop = true

        this.leftArrow = this.game.add.sprite(game.width / 5, this.game.world.centerY + 100, 'arrow')
        this.leftArrow.anchor.setTo(0.5,0.5)
        this.leftArrow.customParams = {direction: 1}
        this.leftArrow.scale.setTo(0.8)
        this.leftArrow.inputEnabled = true
        this.leftArrow.events.onInputDown.add(this.switchChar, this)

        this.rightArrow = this.game.add.sprite(game.width - 400, this.game.world.centerY + 100, 'arrow')
        this.rightArrow.anchor.setTo(0.5,0.5)
        this.rightArrow.customParams = {direction: -1}
        this.rightArrow.inputEnabled = true
        this.rightArrow.events.onInputDown.add(this.switchChar, this)

        this.rightArrow.scale.setTo(-0.8,0.8)
        
        let characterData = 
            [
                {key:'tanjiro', text:'竈門 炭治郎'},
                {key:'nezuko', text:'竈門 禰豆子'},
                {key:'iguro', text:'伊黒 小芭内'},
                {key:'inosuke', text:'嘴平 伊之助'},
                {key:'shinazugawa', text:'不死川 実弥'},
                {key:'shinobu', text:'胡蝶 しのぶ'},
                {key:'tokito', text:'時透 無一郎'},
                {key:'tomioka', text:'冨岡 義勇'},
                {key:'zenitsu', text:'我妻 善逸'},
                
            ]

        this.characters = this.game.add.group()

        let self = this
        let character
        characterData.forEach(function(element) {
            character = self.characters.create(-1000, self.game.world.centerY, element.key)
            character.customParams = {text: element.text}
            character.anchor.setTo(0.5,0.5)
            character.scale.setTo(1.0)
        })

        this.currentCharacter = this.characters.next()
        this.currentCharacter.position.set(this.game.world.centerX, this.world.centerY)
        this.currentCharacter.scale.setTo(1.0)
        this.showText(this.currentCharacter)
    },

    switchChar: function(sprite) {
        if(this.isMoving) {
            return false
        }

        this.isMoving = true
        this.nameText.visible = false

        let newChar, endX
        if(sprite.customParams.direction > 0) {
            newChar = this.characters.next()
            newChar.x = -newChar.width/2
            endX = 2280 + this.currentCharacter.width/2
        } else {
            newChar = this.characters.previous()
            newChar.x = 2280 + newChar.width/2
            endX = -this.currentCharacter.width/2
        }

        let newCharMovement = this.game.add.tween(newChar)
        newCharMovement.to({x:this.game.world.centerX}, 1000)
        newCharMovement.onComplete.add(function() {
            this.isMoving = false
            this.showText(newChar)
        }, this)
        newCharMovement.start()
        let currentCharMovement = this.game.add.tween(this.currentCharacter)
        currentCharMovement.to({x: endX}, 1000)
        currentCharMovement.start()
        
        this.currentCharacter = newChar
    },

    showText: function(character) {
        this.nameText.setText(character.customParams.text)
        this.nameText.visible = true
    }
};

let game = new Phaser.Game(2208, 1242,Phaser.Canvas)

game.state.add('GameState', GameState)
game.state.start('GameState')