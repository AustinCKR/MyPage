/**
 * Reusable Unity WebGL Game Loader
 * Handles loading and initialization of Unity WebGL games
 */
class UnityGameLoader {
    constructor(config) {
        this.gameName = config.gameName;
        this.gameBasePath = config.gameBasePath || `/games/${this.gameName}`;
        this.buildBaseName = config.buildBaseName || 'WebGLBuilds';
        this.canvasSelector = config.canvasSelector || '#unity-canvas';
        this.containerSelector = config.containerSelector || '#unity-container';
        this.companyName = config.companyName || 'DefaultCompany';
        this.productVersion = config.productVersion || '1.0.0';
        
        this.canvas = document.querySelector(this.canvasSelector);
        this.container = document.querySelector(this.containerSelector);
        this.unityInstance = null;
        
        this.init();
    }

    init() {
        console.log(`Initializing Unity game: ${this.gameName}`);
        this.setupMobileDetection();
        this.loadGame();
    }

    setupMobileDetection() {
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            // Mobile configuration
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
            document.getElementsByTagName('head')[0].appendChild(meta);
            
            if (this.container) {
                this.container.className = 'unity-mobile';
            }
            if (this.canvas) {
                this.canvas.className = 'unity-mobile';
            }
        } else {
            // Desktop configuration
            if (this.canvas) {
                this.canvas.style.width = '960px';
                this.canvas.style.height = '600px';
            }
        }
    }

    showBanner(msg, type) {
        console.log('Unity Banner:', type, msg);
        const warningBanner = document.querySelector('#unity-warning');
        if (!warningBanner) return;

        const updateBannerVisibility = () => {
            warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        };

        const div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);

        if (type === 'error') {
            div.className = 'error-message';
            div.style = 'background: rgba(255, 0, 0, 0.2); color: white; padding: 10px; border: 2px solid red;';
        } else if (type === 'warning') {
            div.style = 'background: rgba(255, 255, 0, 0.2); color: white; padding: 10px; border: 2px solid yellow;';
            setTimeout(() => {
                if (div.parentNode) {
                    warningBanner.removeChild(div);
                    updateBannerVisibility();
                }
            }, 5000);
        }
        updateBannerVisibility();
    }

    loadGame() {
        const buildUrl = `${this.gameBasePath}/Build`;
        const loaderUrl = `${buildUrl}/${this.buildBaseName}.loader.js`;

        console.log('Loading Unity game from:', loaderUrl);
        console.log('Build URL:', buildUrl);

        const config = {
            arguments: [],
            dataUrl: `${buildUrl}/${this.buildBaseName}.data.gz`,
            frameworkUrl: `${buildUrl}/${this.buildBaseName}.framework.js.gz`,
            codeUrl: `${buildUrl}/${this.buildBaseName}.wasm.gz`,
            streamingAssetsUrl: `${this.gameBasePath}/StreamingAssets`,
            companyName: this.companyName,
            productName: this.gameName,
            productVersion: this.productVersion,
            showBanner: (msg, type) => this.showBanner(msg, type),
        };

        console.log('Unity Config:', config);

        const script = document.createElement('script');
        script.src = loaderUrl;

        script.onerror = () => {
            console.error('Failed to load Unity loader script:', loaderUrl);
            this.showBanner(
                `Failed to load Unity loader script. Please check if the file exists at: ${loaderUrl}`,
                'error'
            );
        };

        script.onload = () => {
            console.log('Unity loader script loaded successfully');
            const loadingBar = document.querySelector('#unity-loading-bar');
            const progressBarFull = document.querySelector('#unity-progress-bar-full');
            
            if (loadingBar) {
                loadingBar.style.display = 'block';
            }

            createUnityInstance(this.canvas, config, (progress) => {
                console.log('Loading progress:', Math.round(progress * 100) + '%');
                if (progressBarFull) {
                    progressBarFull.style.width = 100 * progress + '%';
                }
            })
                .then((unityInstance) => {
                    console.log('Unity instance created successfully');
                    this.unityInstance = unityInstance;
                    
                    if (loadingBar) {
                        loadingBar.style.display = 'none';
                    }

                    // Setup fullscreen button
                    const fullscreenButton = document.querySelector('#unity-fullscreen-button');
                    if (fullscreenButton) {
                        fullscreenButton.onclick = () => {
                            this.unityInstance.SetFullscreen(1);
                        };
                    }
                })
                .catch((message) => {
                    console.error('Unity instance creation failed:', message);
                    this.showBanner(`Failed to create Unity instance: ${message}`, 'error');
                });
        };

        document.body.appendChild(script);
    }

    // Public method to send messages to Unity
    sendMessage(objectName, methodName, value) {
        if (this.unityInstance) {
            this.unityInstance.SendMessage(objectName, methodName, value);
        } else {
            console.warn('Unity instance not loaded yet');
        }
    }

    // Public method to quit the game
    quit() {
        if (this.unityInstance) {
            this.unityInstance.Quit();
        }
    }
}

// Make it globally accessible
window.UnityGameLoader = UnityGameLoader;