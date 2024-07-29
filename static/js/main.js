const rooms = [
    'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/entity-classvaluation-1/4869-regal-dr--bonita-springs--fl-34134--usa/no-unit/26/primary/above-grade/level-1/clones/pool/model/iteration_30000.splat',
    'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/entity-classvaluation-1/584-banyan-blvd--naples--fl-34102--usa/no-unit/26/primary/above-grade/level-1/clones/living-room/model/iteration_30000.splat',
    'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/entity-classvaluation-1/15295-burnaby-dr--naples--fl-34110--usa/no-unit/26/primary/above-grade/level-1/clones/living-room/model/iteration_30000.splat',
    'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/no-entity/26/584-banyan-blvd--naples--fl-34102--usa/no-unit/primary/above-grade/level-1/clones/garage/model/iteration_30000.splat',
    'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/no-entity/26/602-banyan-blvd--naples--fl-34102--usa/no-unit/secondary/detached-garage/above-grade/level-1/clones/room/model/iteration_30000.splat',
    'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/no-entity/26/584-banyan-blvd--naples--fl-34102--usa/no-unit/primary/above-grade/level-1/clones/club-room/model/iteration_30000.splat',
    'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/no-entity/26/584-banyan-blvd--naples--fl-34102--usa/no-unit/primary/above-grade/level-2/clones/lounge---loft/model/iteration_30000.splat',
    'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/no-entity/27/365-5th-ave-s--naples--fl-34102--usa/301/primary/above-grade/level-1/clones/livingroomnew/model/iteration_30000.splat',
    'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/no-entity/26/3396-crayton-rd--naples--fl-34103--usa/no-unit/primary/above-grade/level-1/clones/living-room/model/iteration_30000.splat',
    'https://link.storjshare.io/raw/jvxxeyhejguiei247jpxmx4vluua/neuron-dev-datastore/instaplan-master/no-super-entity/entity-classvaluation-1/15295-burnaby-dr--naples--fl-34110--usa/no-unit/26/primary/above-grade/level-1/clones/living-room/model/iteration_30000.splat',
];


const paramsForEachRoom = [
    {
        rotation: new THREE.Euler(4.45, 1.15, 0.31),
    },
    {
        rotation: new THREE.Euler(4.48, 0.37, 0.42),
    },
    {
        rotation: new THREE.Euler(4.48, 0.37, 0.42),
    },
    {
        rotation: new THREE.Euler(4.48, 0.37, 0.42),
    },
    {
        rotation: new THREE.Euler(4.48, 0.37, 0.42),
    },
    {
        rotation: new THREE.Euler(4.48, 0.37, 0.42),
    },
    {
        rotation: new THREE.Euler(4.48, 0.37, 0.42),
    },
    {
        rotation: new THREE.Euler(4.48, 0.37, 0.42),
    },
    {
        rotation: new THREE.Euler(4.48, 0.37, 0.42),
    },
    {
        rotation: new THREE.Euler(4.48, 0.37, 0.42),
    },
    {
        rotation: new THREE.Euler(4.48, 0.37, 0.42),
    },
    {
        rotation: new THREE.Euler(4.48, 0.37, 0.42),
    },
];

const current = {
    room: 0,
};


let controlsOpen = false;
let cameraUp = new THREE.Vector3();

const controlButtons = document.querySelectorAll('.control-button');
const buttonArray = [];

controlButtons.forEach((button, i) => {
    if (!button.classList.contains('toggle-control-button')) {
        button.style.display = 'none';
    }
    buttonArray.push(button);
});

buttonArray[0].addEventListener('pointerdown', resetPosition);
buttonArray[1].addEventListener('pointerdown', () => {
    verticalCtrl(0);
});
buttonArray[2].addEventListener('pointerdown', () => {
    verticalCtrl(1);
});

buttonArray[3].addEventListener('pointerdown', toggleControls);

function verticalCtrl(side) {
    if (side === 0) {
        viewer.camera.position.x -= 0.1;
        viewer.controls.target.x -= 0.1;
    }

    if (side === 1) {
        viewer.camera.position.x += 0.1;
        viewer.controls.target.x += 0.1;
    }
}

function resetPosition() {
    viewer.camera.position.set(27.070498222943467, 0.00312424432213776, -3.0);
    viewer.camera.lookAt(53.68, 1.6, 10);
}

function rotateCtrl(side) {
    const tempMatrixLeft = new Matrix4();
    const tempMatrixRight = new Matrix4();
    const forward = new THREE.Vector3();

    forward.set(0, 0, -1);
    forward.transformDirection(viewer.camera.matrixWorld);
    tempMatrixLeft.makeRotationAxis(forward, Math.PI / 128);
    tempMatrixRight.makeRotationAxis(forward, -Math.PI / 128);

    if (side === 0) viewer.camera.up.transformDirection(tempMatrixRight);
    if (side === 1) viewer.camera.up.transformDirection(tempMatrixLeft);
}


function toggleControls() {
    if (!controlsOpen) {
        controlsOpen = true;
        buttonArray.forEach((button, i) => {
            if (!button.classList.contains('toggle-control-button')) {
                button.style.display = 'initial';
            }
        });
        buttonArray[3].textContent = '-';
    } else {
        controlsOpen = false;
        buttonArray.forEach((button, i) => {
            if (!button.classList.contains('toggle-control-button')) {
                button.style.display = 'none';
            }
        });
        buttonArray[3].textContent = '+';
    }
}

function eulerToQuaternion(euler) {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(euler);
    return quaternion;
}

let viewer = new Viewer({
    // cameraUp: [-1, 0, -0.1],
    initialCameraPosition: [27.070498222943467, 0.00312424432213776, -3.0],
    // initialCameraLookAt: [53.68, 1.6, 10],
    initialCameraLookAt: [0, 0, 0],
    sceneRevealMode: 1,
    gpuAcceleratedSort: true,
    enableSIMDInSort: true,
    useBuiltInControls: false,
});

let controls = new PointerLockControls(
    viewer.camera,
    viewer.renderer.domElement,
);

// document.getElementById('roomSelect').addEventListener('change', changeRoom);

/*
* if we have dropdown to select new room, we can use this method later
* */
function changeRoom() {
    const select = this.value;

    viewer.dispose();
    controls.dispose();

    viewer = new Viewer({
        // cameraUp: [-1, 0, -0.1],
        initialCameraPosition: [27.070498222943467, 0.00312424432213776, -3.0],
        initialCameraLookAt: [53.68, 1.6, 10],
        sceneRevealMode: 1,
        gpuAcceleratedSort: true,
        enableSIMDInSort: true,
        useBuiltInControls: false,
    });

    let roomLink = rooms[select[4]];
    let room_number = rooms.indexOf(roomLink);

    let newRotation = paramsForEachRoom[room_number].rotation;
    let fixed_new_rotaion = eulerToQuaternion(newRotation);

    viewer
        .addSplatScene(rooms[select[4]], {
            splatAlphaRemovalThreshold: 20,
            showLoadingUI: true,
            position: [30, 0, 0],
            rotation: [
                fixed_new_rotaion.w,
                fixed_new_rotaion.x,
                fixed_new_rotaion.y,
                fixed_new_rotaion.z,
            ], // Convert Quaternion to array
            scale: [1.5, 1.5, 1.5],
            progressiveLoad: true,
        })
        .then(() => {
            onLoad(select[4]);
            viewer.start();
            controls = new PointerLockControls(
                viewer.camera,
                viewer.renderer.domElement,
            );
        });
}

function onLoad() {
    console.log("Loading new model .....")
}

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;


const keysPressed = {
    forward: false,
    backward: false,
    left: false,
    right: false,
};


let joySensX = 1;
let joySensY = 1;

document.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            keysPressed.forward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            keysPressed.left = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keysPressed.backward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keysPressed.right = true;
            break;
    }
});

document.addEventListener('keyup', function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            keysPressed.forward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            keysPressed.left = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keysPressed.backward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keysPressed.right = false;
            break;
    }
});

function moveCamera() {
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const moveDistance = 0.1;

    const frontVector = new THREE.Vector3(0, 0, -1); // Inverted to correct the direction
    const sideVector = new THREE.Vector3(1, 0, 0);

    direction.z = Number(keysPressed.forward) - Number(keysPressed.backward);
    direction.x = Number(keysPressed.right) - Number(keysPressed.left);
    direction.normalize();

    if (keysPressed.forward || keysPressed.backward)
        velocity.add(
            frontVector.multiplyScalar(-direction.z * moveDistance * joySensY),
        );
    if (keysPressed.left || keysPressed.right)
        velocity.add(
            sideVector.multiplyScalar(direction.x * moveDistance * joySensX),
        );

    controls.moveForward(velocity.z);
    controls.moveRight(velocity.x);

    requestAnimationFrame(moveCamera);
}

moveCamera();


let joystickCenterX, joystickCenterY;
let joystickRadius = 75; // Half of joystick-container size (150px)
let moveX = 0,
    moveY = 0;
let down = false;

const joystick = document.getElementById('joystick');

joystick.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const rect = joystick.getBoundingClientRect();
    joystickCenterX = rect.left + rect.width / 2;
    joystickCenterY = rect.top + rect.height / 2;
    down = true;
    updateMovement(e.clientX, e.clientY);
});

joystick.addEventListener('mousemove', (e) => {
    if (!down) return;
    e.preventDefault();
    updateMovement(e.clientX, e.clientY);
});

joystick.addEventListener('mouseup', (e) => {
    e.preventDefault();
    stopMovement();
});

joystick.addEventListener('mouseleave', (e) => {
    if (down) {
        stopMovement();
    }
});

joystick.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = joystick.getBoundingClientRect();
    joystickCenterX = rect.left + rect.width / 2;
    joystickCenterY = rect.top + rect.height / 2;
    down = true;
    updateMovement(e.touches[0].clientX, e.touches[0].clientY);
});

joystick.addEventListener('touchmove', (e) => {
    if (!down) return;
    e.preventDefault();
    updateMovement(e.touches[0].clientX, e.touches[0].clientY);
});

joystick.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopMovement();
});

function updateMovement(clientX, clientY) {
    let dx = clientX - joystickCenterX;
    let dy = clientY - joystickCenterY;
    let distance = Math.hypot(dx, dy);

    if (distance > joystickRadius) {
        let angle = Math.atan2(dy, dx);
        dx = joystickRadius * Math.cos(angle);
        dy = joystickRadius * Math.sin(angle);
    }

    joystick.style.transform = `translate(${dx}px, ${dy}px)`;
    if (dy < -10) {
        keysPressed.forward = true;
        keysPressed.backward = false;
    }
    if (dy > 10) {
        keysPressed.backward = true;
        keysPressed.forward = false;
    }
    if (dx > 10) {
        keysPressed.left = false;
        keysPressed.right = true;
    }
    if (dx < -10) {
        keysPressed.right = false;
        keysPressed.left = true;
    }

    joySensX = Math.abs(dx / 30);
    joySensY = Math.abs(dy / 30);

    moveX = (dx / joystickRadius) * 0.1;
    moveY = (dy / joystickRadius) * 0.1;
}

function stopMovement() {
    joySensX = joySensY = 1;
    down = false;
    moveX = moveY = 0;
    joystick.style.transform = 'translate(0px, 0px)';
    Object.keys(keysPressed).forEach(key => (keysPressed[key] = false));
}

function logCameraPositionAndDirection() {
    console.log(
        'Camera Position:',
        camera.position.x,
        camera.position.y,
        camera.position.z,
    );

    const lookAtVector = new THREE.Vector3();
    lookAtVector.set(0, 0, -1); // Assuming the camera is looking along the negative z-axis
    lookAtVector.applyQuaternion(camera.quaternion);

    console.log(
        'Camera Direction (look at):',
        lookAtVector.x,
        lookAtVector.y,
        lookAtVector.z,
    );
}

function update() {
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();

    const frontVector = new THREE.Vector3(0, 0, -1);
    const sideVector = new THREE.Vector3(-1, 0, 0);

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward)
        velocity.add(frontVector.multiplyScalar(-direction.z));
    if (moveLeft || moveRight)
        velocity.add(sideVector.multiplyScalar(-direction.x));

    controls.moveForward(velocity.z * 0.1);
    controls.moveRight(velocity.x * 0.1);

    if (controls) {
        controls.update();
        console.log('yo');
    }

    requestAnimationFrame(update);
}


document.addEventListener("DOMContentLoaded", () => {
    const controlButtons = document.querySelectorAll(".control-button:not(.toggle-control-button)");
    controlButtons.forEach((button) => {
        button.style.display = "block";
    });
    const toggleButton = document.querySelector(".toggle-control-button");
    toggleButton.textContent = "-";
});

let progress = 0;


async function fetchWithErrorHandling(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}


async function fetchSplatFile() {
    try {
        const response = await fetch('/splat_file');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('Error loading splat file:', error);
        throw error;
    }
}

async function fetchModelData(url) {
    // const response = await fetchWithErrorHandling(url, {
    //     mode: "cors",
    //     credentials: "omit",
    // });

    const response = await fetchSplatFile();
    const reader = response.body.getReader();
    const contentLength = +response.headers.get('Content-Length');

    let receivedLength = 0;
    const chunks = [];

    while (true) {
        const {done, value} = await reader.read();
        if (done) {
            break;
        }
        chunks.push(value);
        receivedLength += value.length;

        const percentComplete = (receivedLength / contentLength) * 100;
        updateLoadingProgress(percentComplete);
    }

    return new Blob(chunks);
}

function updateLoadingProgress(percentComplete) {
    const loadingBar = document.querySelector('.splash-loading-bar');
    const loadingText = document.querySelector('.splash-loading-text');

    loadingBar.style.width = percentComplete + '%';
    loadingText.textContent = `${Math.round(percentComplete)}%`;
}

// this is different impl.
function findMatchingRoomIndex(url) {
    const index = rooms.indexOf(url);
    return index !== -1 ? index : 2;  // Return 2 if not found
}


async function loadCubeSpaceModel() {
    const url = document.getElementById("model-link").getAttribute("href");
    console.log("URL: " + url);

    // const ROOM_INDEX = findMatchingRoomIndex(url);
    const ROOM_INDEX = 1;

    const splashLoadingWrapper = document.getElementById('splash-loading-wrapper');

    try {
        const blob = await fetchModelData(url);
        const objectUrl = URL.createObjectURL(blob);

        const newRotation = paramsForEachRoom[ROOM_INDEX].rotation;
        const fixedNewRotation = eulerToQuaternion(newRotation);

        await viewer.addSplatScene(objectUrl, {
            splatAlphaRemovalThreshold: 20,
            showLoadingUI: false,
            position: [30, 0, 0],
            rotation: [
                fixedNewRotation.w,
                fixedNewRotation.x,
                fixedNewRotation.y,
                fixedNewRotation.z,
            ],
            scale: [1.5, 1.5, 1.5],
            progressiveLoad: true,
            format: SceneFormat.Splat
        });

        viewer.start();
        controls = new PointerLockControls(
            viewer.camera,
            viewer.renderer.domElement,
        );

        splashLoadingWrapper.style.display = "none";
    } catch (error) {
        console.error("Error loading cube space model:", error);
    }
}

loadCubeSpaceModel().catch((err) => {
    console.error("Unhandled error in main:", err);
});