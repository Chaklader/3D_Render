const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
const _vector = new THREE.Vector3();

const _changeEvent = { type: 'change' };

const _PI_2 = Math.PI / 2;

class PointerLockControls extends THREE.EventDispatcher {
    constructor(camera, domElement) {
        super();

        this.camera = camera;
        this.domElement = domElement;

        this.isDragging = false;
        this.isTouching = false;
        this.touchStartX = 0;
        this.touchStartY = 0;

        this.minPolarAngle = 0; // radians
        this.maxPolarAngle = Math.PI; // radians

        this.pointerSpeed = 2.0;

        this.moveSpeed = 0.05;

        this._onMouseMove = onMouseMove.bind(this);
        this._onMouseDown = onMouseDown.bind(this);
        this._onMouseUp = onMouseUp.bind(this);
        this._onTouchStart = onTouchStart.bind(this);
        this._onTouchMove = onTouchMove.bind(this);
        this._onTouchEnd = onTouchEnd.bind(this);
        this._onKeyDown = onKeyDown.bind(this);
        this._onKeyUp = onKeyUp.bind(this);

        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
        };

        this.connect();
    }

    connect() {
        this.domElement.addEventListener('mousemove', this._onMouseMove);
        this.domElement.addEventListener('mousedown', this._onMouseDown);
        this.domElement.addEventListener('mouseup', this._onMouseUp);
        this.domElement.addEventListener('touchstart', this._onTouchStart);
        this.domElement.addEventListener('touchmove', this._onTouchMove);
        this.domElement.addEventListener('touchend', this._onTouchEnd);
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
    }

    disconnect() {
        this.domElement.removeEventListener('mousemove', this._onMouseMove);
        this.domElement.removeEventListener('mousedown', this._onMouseDown);
        this.domElement.removeEventListener('mouseup', this._onMouseUp);
        this.domElement.removeEventListener('touchstart', this._onTouchStart);
        this.domElement.removeEventListener('touchmove', this._onTouchMove);
        this.domElement.removeEventListener('touchend', this._onTouchEnd);
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }

    dispose() {
        this.disconnect();
    }

    getObject() {
        // retaining this method for backward compatibility

        return this.camera;
    }

    getDirection(v) {
        return v.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
    }

    moveForward(distance) {
        // move forward parallel to the xz-plane
        // assumes camera.up is y-up

        const camera = this.camera;

        _vector.setFromMatrixColumn(camera.matrix, 0);

        _vector.crossVectors(camera.up, _vector);

        camera.position.addScaledVector(_vector, distance);
    }

    moveRight(distance) {
        const camera = this.camera;

        _vector.setFromMatrixColumn(camera.matrix, 0);

        camera.position.addScaledVector(_vector, distance);
    }

    update() {
        const camera = this.camera;

        if (this.keys.forward) {
            _euler.setFromQuaternion(camera.quaternion);
            _euler.x += this.moveSpeed; // Inverted forward movement
            _euler.x = Math.max(
                _PI_2 - this.maxPolarAngle,
                Math.min(_PI_2 - this.minPolarAngle, _euler.x),
            );
            camera.quaternion.setFromEuler(_euler);
        }

        if (this.keys.backward) {
            _euler.setFromQuaternion(camera.quaternion);
            _euler.x -= this.moveSpeed; // Inverted backward movement
            _euler.x = Math.max(
                _PI_2 - this.maxPolarAngle,
                Math.min(_PI_2 - this.minPolarAngle, _euler.x),
            );
            camera.quaternion.setFromEuler(_euler);
        }

        if (this.keys.left) {
            _euler.setFromQuaternion(camera.quaternion);
            _euler.y += this.moveSpeed; // Inverted left movement
            camera.quaternion.setFromEuler(_euler);
        }

        if (this.keys.right) {
            _euler.setFromQuaternion(camera.quaternion);
            _euler.y -= this.moveSpeed; // Inverted right movement
            camera.quaternion.setFromEuler(_euler);
        }

        this.dispatchEvent(_changeEvent);
    }
}

// event listeners

function onMouseMove(event) {
    if (this.isDragging === false) return;

    const movementX =
        event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY =
        event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    const camera = this.camera;
    _euler.setFromQuaternion(camera.quaternion);

    _euler.y += movementX * 0.002 * this.pointerSpeed; // Inverted horizontal movement
    _euler.x += movementY * 0.002 * this.pointerSpeed; // Inverted vertical movement

    _euler.x = Math.max(
        _PI_2 - this.maxPolarAngle,
        Math.min(_PI_2 - this.minPolarAngle, _euler.x),
    );

    camera.quaternion.setFromEuler(_euler);

    this.dispatchEvent(_changeEvent);
}

function onMouseDown(event) {
    this.isDragging = true;
}

function onMouseUp(event) {
    this.isDragging = false;
}

function onTouchStart(event) {
    if (event.touches.length === 1) {
        this.isTouching = true;
        this.touchStartX = event.touches[0].pageX;
        this.touchStartY = event.touches[0].pageY;
    }
}

function onTouchMove(event) {
    if (this.isTouching === false) return;
    if (event.touches.length !== 1) return;

    const touchX = event.touches[0].pageX;
    const touchY = event.touches[0].pageY;

    const movementX = touchX - this.touchStartX;
    const movementY = touchY - this.touchStartY;

    this.touchStartX = touchX;
    this.touchStartY = touchY;

    const camera = this.camera;
    _euler.setFromQuaternion(camera.quaternion);

    _euler.y += movementX * 0.002 * this.pointerSpeed; // Inverted horizontal movement
    _euler.x += movementY * 0.002 * this.pointerSpeed; // Inverted vertical movement

    _euler.x = Math.max(
        _PI_2 - this.maxPolarAngle,
        Math.min(_PI_2 - this.minPolarAngle, _euler.x),
    );

    camera.quaternion.setFromEuler(_euler);

    this.dispatchEvent(_changeEvent);
}

function onTouchEnd(event) {
    this.isTouching = false;
}

function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW':
            this.keys.forward = true;
            break;
        case 'KeyA':
            this.keys.left = true;
            break;
        case 'KeyS':
            this.keys.backward = true;
            break;
        case 'KeyD':
            this.keys.right = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW':
            this.keys.forward = false;
            break;
        case 'KeyA':
            this.keys.left = false;
            break;
        case 'KeyS':
            this.keys.backward = false;
            break;
        case 'KeyD':
            this.keys.right = false;
            break;
    }
}
