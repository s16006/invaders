
"use strict";
/**
 * インベーダーみたいなやつ作ります
 */

class Player {
    /**
     * @return {number}
     */
    static get HALF_WIDTH() {
        return 20;
    }

    constructor(input, x, y, speed, canvas_width) {
        this.input = input;
        this.pos = {'x': x, 'y': y};
        this.bullet = null;
        this.speed = speed;
        this.canvas_width = canvas_width;
    }

    getBullet() {
        return this.bullet;
    }

    move() {
        if (this.input.isLeft && this.input.isRight) {
            // なにもしない
        } else if (this.input.isLeft) {
            this.pos.x -= this.speed;
        } else if (this.input.isRight) {
            this.pos.x += this.speed;
        }
        // 左側へ行き過ぎたら戻す
        if (this.pos.x < Player.HALF_WIDTH) {
            this.pos.x = Player.HALF_WIDTH;
        }
        // 右側へ行きすぎたら戻す
        if (this.pos.x > this.canvas_width - Player.HALF_WIDTH) {
            this.pos.x = this.canvas_width - Player.HALF_WIDTH;
        }

    }

    draw(ctx) {
        this.move();

        if (this.input.isSpace && this.bullet == null) {
            this.bullet = new Bullet(this.pos.x, this.pos.y);
        }
        if (this.bullet != null) {
            this.bullet.draw(ctx);
            if (!this.bullet.isValid()) {
                this.bullet = null;
            }
        }

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.strokeStyle = "#FFF";
        ctx.fillStyle = "#FFF";

        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(-20, 10);
        ctx.lineTo(-20, -7);
        ctx.lineTo(-3, -7);
        ctx.lineTo(0, -10);
        ctx.lineTo(3, -7);
        ctx.lineTo(20, -7);
        ctx.lineTo(20, 10);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.restore();
    }
}

class Input {
    constructor() {
        this.isLeft = false;
        this.isRight = false;
        this.isSpace = false;
    }

    onKeyDown(event) {
        switch (event.code) {
            case "ArrowLeft":
                this.isLeft = true;
                break;
            case "ArrowRight":
                this.isRight = true;
                break;
            case "Space":
                this.isSpace = true;
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    onKeyUp(event) {
        switch (event.code) {
            case "ArrowLeft":
                this.isLeft = false;
                break;
            case "ArrowRight":
                this.isRight = false;
                break;
            case "Space":
                this.isSpace = false;
                break;
            default:
                return;
        }
        event.preventDefault();
    }
}

class Bullet {
    /**
     * @return {number}
     */
    static get SPEED() {
        return 15;
    }

    /**
     * @return {number}
     */
    static get HALF_HEIGHT() {
        return 5;
    }

    /**
     * @return {number}
     */
    static get HALF_WIDTH() {
        return 1.5;
    }

    constructor(x, y) {
        this.pos = {'x': x, 'y': y};
        this.isCollied = false;
    }

    move() {
        this.pos.y -= Bullet.SPEED;
    }

    isValid() {
        if (this.isCollied){
            return false;
        }
        return this.pos.y >= -Bullet.HALF_HEIGHT;
    }

    setInvalidate() {
        this.isCollied = true;
    }

    draw(ctx) {
        this.move();

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(0, 5);
        ctx.stroke();

        ctx.restore();
    }
}

class Enemy {
    /**
     * @return {number}
     */
    static get HALF_SIZE() {
        return Enemy.SIZE / 2;
    }

    /**
     * @return {number}
     */
    static get SIZE() {
        return 64;
    }


    constructor(image, x, y) {
        this.image = image;
        this.pos = {'x': x, 'y': y};
    }

    move(dx, dy) {
        this.pos.x += dx;
        this.pos.y += dy;

    }


    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);

        // 画像サイズの半分を左と上にずらして基準点の真ん中に来るように調整して描画
        ctx.drawImage(this.image, -Enemy.HALF_SIZE, -Enemy.HALF_SIZE,
            Enemy.SIZE, Enemy.SIZE);

        ctx.restore();
    }

    isCollision(bullet) {
        // まず横の判定の準備?
        let dx = Math.abs(this.pos.x - bullet.pos.x);
        let dw = Enemy.HALF_SIZE + Bullet.HALF_WIDTH;
        // 縦の判定準備
        let dy = Math.abs(this.pos.y - bullet.pos.y);
        let dh = Enemy.HALF_SIZE + Bullet.HALF_HEIGHT;
        // 判定
        return (dx < dw && dy < dh);
    }
}

class EnemyManager {　 // dx dy width height score の追加
    constructor(dx, dy, width, height, score) {
        this.dx = dx;　// x軸の動き
        this.dy = dy;　// y軸の動き
        this.canvas_width = width; // 画面幅の設定
        this.height = height; // 画面高さの設定
        this.score = score; // scoreの設定
        this.kara = []; // scoreの設定のカラリスト
        this.enemyList = [];
    }


    move() { //moveの追加  理想の動きを作れませんでした！
        this.enemyList.forEach(
            (enemy) => enemy.move(this.dx, this.dy)); //１個１個に動きを与えている

        for (let vv = 0; vv <= 0; vv++) { // ??
            if(this.enemyList.length <= 0) {
                alert("gameclear");
            }
            for (let cc = 0; cc < this.enemyList.length; cc++) {
                if (this.enemyList[cc].pos.x >= this.canvas_width - Enemy.HALF_SIZE) { // pos.x = 幅768
                    this.enemyList[cc].pos.y += 10;
                    this.dx *= -1;　// 左へ移動
                }
                if (this.enemyList[cc].pos.x <= (this.canvas_width - this.canvas_width ) + Enemy.HALF_SIZE) { // pos.x = 幅32
                    this.enemyList[cc].pos.y += 10;
                    this.dx *= -1;　//右へ移動
                }
                if (this.enemyList[cc].pos.y >= this.height - 100) { //gameoverの地点
                    this.dx = 0;
                    this.dy = 0;
                    alert("gameover");
                    break;
                }
            }
        }
    }


    generateEnemies() {
        let image = new Image();
        image.src = "utyuuzin.png";
        for (let h = 0; h < 3; h++) {
            for (let w = 0; w < 5; w++) {
                this.enemyList.push(
                    new Enemy(image,
                        50 + Enemy.SIZE * w,
                        50 + Enemy.SIZE / 2 * h));
            }
        }
    }

    draw(ctx) {
        this.enemyList.forEach(
            (enemy) => enemy.draw(ctx)
        );
    }

    collision(bullet) { //scoreの追加　足してまとめるやり方がわかりませんでした！
        if (bullet == null) {
            return;
        }

        const length = this.enemyList.length;
        let plus = parseInt(100); //int100の変数
        let hs = this.kara;　//カラリストからの変数
        for (let i = 0; i < length; i++) {
            if (this.enemyList[i].isCollision(bullet)) { //もしIたちが衝突したら
                this.enemyList.splice(i, 1); //Iを置換？
                bullet.setInvalidate();　//？？
                this.kara.push(plus);　//カラリストへアペンド
                this.score.textContent = "score:" + hs; // score + 数字を表示
                return;
            }
        }
    }
}



window.addEventListener("DOMContentLoaded", function () {　//変数dx,dy,score, EnemyManagerにdx,dy,WIDTH,HEIGHT,scoreの追加
    // 必要な定数、変数を設定しておく
    const canvas = document.getElementById("main");
    const ctx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const SPF = 1000 / 30;
    const PLAYER_SPEED = 5;

    let dx = 10; //dxの追加
    let dy = 0; //dyの追加
    let score = document.getElementById("score_block"); //scoreの追加
    let input = new Input();
    let player = new Player(input, WIDTH / 2, HEIGHT * 14 / 15, PLAYER_SPEED, WIDTH);

    // キーボード入力イベントをInputクラスとバインド
    document.addEventListener("keydown", (evt) => input.onKeyDown(evt));
    document.addEventListener("keyup", (evt) => input.onKeyUp(evt));

    // EnemyManagerの準備
    let manager = new EnemyManager(dx,dy, WIDTH, HEIGHT, score); //EnemyManagerのコンストラクタへdx,dy,WIDTH,HEIGHT,scoreを飛ばす
    manager.generateEnemies();

    // メインループ
    let mainLoop = function () {　//敵の移動を追加
        // 画面消去
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // プレイヤーの描画
        player.draw(ctx);

        // 敵の衝突判定
        manager.collision(player.getBullet());

        // 敵の描画
        manager.draw(ctx);

        //敵の移動
        manager.move(dx,dy);　//敵の移動を追加

        // 再度この関数を呼び出す予約をする
        setTimeout(mainLoop, SPF);
    };
    // ゲーム起動開始
    setTimeout(mainLoop, SPF);
});
