var game = new Phaser.Game(800, 600, 
    Phaser.AUTO, // Phaser.WEBGL | Phaser.CANVAS
    '', // id of DOM 
    {
    preload: preload,
    create: create,
    update: update
});

var score = 0;
var scoreText = '';

function preload() {
    game.load.image('sky', 'assets/sky.png')
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.add.sprite(0,0, 'sky') // background

    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'ground')
    ground.scale.setTo(2,2);
    ground.body.immovable = true; // 不動 = 静的オブジェクト

    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true

    stars = game.add.group();
    stars.enableBody = true;
    for (var i = 0; i < 12; i++) {
        var star = stars.create(i*70, 0, 'star');
        star.body.gravity.y = 6;
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    player = game.add.sprite(32, game.world.height -450, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.05;
    player.body.gravity.y = 2000;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

    scoreText = game.add.text(16, 16, 'スコア: 0', {fontSize: '32px', fill: '#fff '});
}
function update() {
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    game.physics.arcade.overlap(player, stars, function(player, star) {
        star.kill();
        score += 10;
        scoreText.text = `スコア: ${score}`;
    }, null, this);

    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
        player.body.velocity.x = -250;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 250;
        player.animations.play('right');
    } else {
        player.animations.stop();
        player.frame = 4; // 正面を向く
    }

    // 地面についている時に、上キーを押したら、ジャンプ
    if (player.body.touching.down && hitPlatform) {
        if (cursors.up.isDown) {
            player.body.velocity.y = -950;
        }
    }
}