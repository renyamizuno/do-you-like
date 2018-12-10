if(Math.random() <= 0.15) {
  !function() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .window {
          font-family: arial,sans-serif;
          -webkit-font-smoothing: antialiased;
          position: fixed;
          width: 400px;
          height: 160px;
          top: var(--window-top, 30px);
          left: var(--window-left, 50px);
          border: 3px solid #ddd;
          background: white;
          box-sizing: border-box;
          z-index: 10000000;
          font-size: 13px;
        }
        .hide {
          display: none;
        }
        .header {
          height: 20px;
          background: blue;
          padding: 0 3px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #ddd;
        }
        .title {
          color: white;
          font-size: 13px;
        }
        .content {
          height: 131px;
          background: black;
          position: relative;
        }
        .close-button {
          cursor: pointer;
          outline: none;
          border: 0;
          width: 15px;
          height: 15px;
          text-align: center;
          padding: 0;
        }
        .message {
          right: 0;
          top: 0;
          background-repeat: no-repeat;
          background-size: cover;
          position: absolute;
          color: white;
          height: 100%;
          text-align: center;
          line-height: 131px;
          min-width: 130px;
          font-size: 24px;
        }
        .right {
          width: 190px;
          background-image: url("${chrome.extension.getURL("right.png")}");
        }
        .left {
          width: var(--message-left, 275px);
          padding-left: 30px;
          text-align: left;
          padding-left: 30px;
          text-align: left;
          background-size: contain;
          background-image: url("${chrome.extension.getURL("left.png")}");
        }
      </style>
      <div class="window">
        <div class="header">
          <div class="title">あなたは好きですか？</div>
          <button class="close-button">X</button>
        </div>
        <div class="content">
          <div class="left message">
            あなたは IE が
          </div>
          <div class="right message">
            好きですか？
          </div>
        </div>
      </div>
    `;

    const MAX_MESSAGE_LEFT = 340;
    let messageLeft = 275;

    window.customElements.define('do-you-like', class DoYouLike extends HTMLElement {
      respawn() {
        messageLeft += 5;
        const oldWindow = document.querySelector('do-you-like');
        document.body.appendChild(document.createElement('do-you-like'));
        document.body.removeChild(oldWindow);
      }

      hide() {
        this.shadowRoot.querySelector('.window').classList.add('hide');
        setTimeout(_ => this.respawn(), 100);
      }

      constructor() {
        super();
        const root = this.attachShadow({mode: 'open'});
        root.appendChild(template.content.cloneNode(true));
        const vh = Math.round(Math.random() * 60) + 5;
        const vw = Math.round(Math.random() * 60) + 5;
        root.querySelector('.window').style = `--window-top: ${vh}vh; --window-left: ${vw}vw; --message-left: ${messageLeft}px;`;

        if (document.body.querySelectorAll('do-you-like').length > 60) {
          this.moveIE();
        } else if(messageLeft > MAX_MESSAGE_LEFT) {
          setTimeout(_ => document.body.appendChild(document.createElement('do-you-like')), 100);
        } else if (messageLeft > 280) {
          setTimeout(_ => this.hide(), 1000 - ((messageLeft - 280) / (MAX_MESSAGE_LEFT - 280)) * 500);
        } else {
          root.querySelector('.close-button').addEventListener('click', _ => this.hide());
        }
      }

      moveIE() {
        window.location.href = 'https://support.microsoft.com/ja-jp/help/17621/internet-explorer-downloads';
      }
    });

    document.body.appendChild(document.createElement('do-you-like'));
  }();
};
