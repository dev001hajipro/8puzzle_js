// 5 => [0, 1, 2, 3, 4]
const genArray = n => Array.from(Array(n).keys());
const shuffle = arr => arr.sort(() => Math.random() - 0.5);

const PIECE_WIDTH = 200;
const PIECE_HEIGHT = 200;
let cols = 0;
let rows = 0;

let game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
});

function preload() {
    game.load.spritesheet('background', "assets/games/sliding-puzzle/bl.jpg", PIECE_WIDTH, PIECE_HEIGHT);
}

function create() {
    cols = Math.floor(game.world.width / PIECE_WIDTH);
    rows = Math.floor(game.world.height / PIECE_HEIGHT);

    var arr = shuffle(genArray(cols * rows));

    piecesGroup = game.add.group();
    let piecesIndex = 0; // view piece number.
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            if (arr[piecesIndex] != 0) {
                piece = piecesGroup.create(
                    c * PIECE_WIDTH, // x
                    r * PIECE_HEIGHT, // y
                    'background', // image
                    arr[piecesIndex]); // spritesheet frame position.
            } else {
                // 画面の左上、(piecesIndex=0)を黒にする。
                piece = piecesGroup.create(
                    c * PIECE_WIDTH, // x
                    r * PIECE_HEIGHT);
                piece.black = true;
            }
            // 各種情報保持
            piece.name = `piece${r}x${c}`;
            piece.currentIndex = piecesIndex;
            piece.destIndex = arr[piecesIndex];
            piece.inputEnabled = true;
            piece.events.onInputDown.add(selectPiece, this);
            piece.posX = c;
            piece.posY = r;

            piecesIndex++;
        }
    }
}

function selectPiece(piece) {
    let blackPiece = canMove(piece);
    if (blackPiece.length > 0) {
        movePiece(piece, blackPiece[0]);
    }

    checkIfFinished();
}
// 近傍チェック
function canMove(piece) {
    let blackPiece = [];
    piecesGroup.children.forEach(function (e) {
        if (e.posX === (piece.posX - 1) && e.posY === piece.posY && e.black || // 左に黒タイルがある
            e.posX === (piece.posX + 1) && e.posY === piece.posY && e.black || // 右に黒タイルがある
            e.posX === piece.posX && e.posY === (piece.posY - 1) && e.black || // 上に黒タイルがある
            e.posX === piece.posX && e.posY === (piece.posY + 1) && e.black) {// 下に黒タイルがある
            blackPiece.push(e);
        }
    });
    return blackPiece;
}
function movePiece(piece, blackPiece) {
    var tmpPiece = {
        posX: piece.posX,
        posY: piece.posY,
        currentIndex: piece.currentIndex
    };
    // update UI
    game.add.tween(piece).to({
        x: blackPiece.posX * PIECE_WIDTH,
        y: blackPiece.posY * PIECE_HEIGHT
    },
        300, // millies
        Phaser.Easing.Linear.None,
        true);

    ///// SWAP /////
    // piece to black
    piece.posX = blackPiece.posX;
    piece.posY = blackPiece.posY;
    piece.currentIndex = blackPiece.currentIndex;
    piece.name = `piece${blackPiece.posX}x${blackPiece.posY}`;

    // black to piece
    blackPiece.posX = tmpPiece.posX;
    blackPiece.posY = tmpPiece.posY;
    blackPiece.currentIndex = tmpPiece.currentIndex;
    blackPiece.name = `piece${tmpPiece.posX}x${tmpPiece.posY}`;
}

function checkIfFinished() {

}
