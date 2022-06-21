console.clear();

const{gsap, imagesLoaded} = window;

const buttons = {
prev: document.querySelector(".btn--left"),
next: document.querySelector(".btn--right"),
}
const cardContainerEl = document.querySelector(".cards__wrapper");
const appBgContainerEl = document.querySelector(".app__bg");
const cardInfosContainerEl = document.querySelector(".info__wrapper");

buttons.next.addEventListener("click", () => swapCards("right"));
buttons.prev.addEventListener("click", () => swapCards("left"));

function swapCards(direction){
const currentCardEl = cardContainerEl.querySelector(".current--card");
const previousCardEl = cardContainerEl.querySelector(".previous--card");
const nextCardEl = cardContainerEl.querySelector(".next--card");

const currentBgImageEl = appBgContainerEl.querySelector(".current--image")
const previousBgImageEl = appBgContainerEl.querySelector(".previous--image")
const nextBgImageEl = appBgContainerEl.querySelector(".next--image")

changeInfo(direction);
swapCardsClass();

resetCardEvents(currentCardEl);

function swapCardsClass(){
    currentCardEl.classList.remove("current--card");
    previousCardEl.classList.remove("previous--card");
    nextCardEl.classList.remove("next--card");

    currentBgImageEl.classList.remove("current--image");
    previousBgImageEl.classList.remove("previous--image");
    nextBgImageEl.classList.remove("next--image");

    currentCardEl.style.zIndex = "50";
    currentBgImageEl.style.zIndex = "-2";

    if(direction === "right"){
        previousCardEl.style.zIndex = "20";
        nextCardEl.style.zIndex = "30";
        nextBgImageEl.style.zIndex = "-1";

        currentCardEl.classList.add("previous--card");
        previousCardEl.classList.add("next--card");
        nextCardEl.classList.add("current--card");

        currentBgImageEl.classList.add("previous--image");
        previousBgImageEl.classList.add("next--image");
        nextBgImageEl.classList.add("current--image");
    } else if (direction === "left"){
        nextCardEl.style.zIndex = "20";
        previousCardEl.style.zIndex = "30";
        previousBgImageEl.style.zIndex = "-1";

        currentCardEl.classList.add("next--card");
        previousCardEl.classList.add("current--card");
        nextCardEl.classList.add("previous--card");

        currentBgImageEl.classList.add("next--image");
        previousBgImageEl.classList.add("current--image");
        nextBgImageEl.classList.add("previous--image");
    }
}
}
function changeInfo(direction){
    let currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
    let previousInfoEl = cardInfosContainerEl.querySelector(".previous--info");
    let nextInfoEl = cardInfosContainerEl.querySelector(".next--info");

    gsap.timeline()
    .to([buttons.prev, buttons.next ], {
        duration: 0.2,
        opacity: 0.5,
        pointerEvents: "none",
    })
    .to(currentInfoEl.querySelectorAll(".text"), {
        duration: 0.4,
        stagger: 0.1,
        translateY: "-120px",
        opacity: 0,

    }, "-=")
    .call(() => {swapInfoClass(direction);})
    .call(() => initCardEvents())
    .fromTo(
        (direction === "right")
        ? nextInfoEl.querySelectorAll(".text")
        : previousInfoEl.querySelectorAll(".text"),
        {
            opacity: 0,
            translateY: "40px",
            
        },  //from
        {
            opacity: 1,
            translateY: "0px",
            duration: 0.4,
            stagger: 0.1,
        }   //to
    )
    .to([buttons.prev, buttons.next], {
        duration: 0.2,
        opacity: 1,
        pointerEvents: "all",
    })

    function swapInfoClass(){
        currentInfoEl.classList.remove("current--info");
        previousInfoEl.classList.remove("previous--info");
        nextInfoEl.classList.remove("next--info");
    if(direction === "right"){
        currentInfoEl.classList.add("previous--info");
        previousInfoEl.classList.add("next--info");
        nextInfoEl.classList.add("current--info");
    } else if (direction === "left"){
        currentInfoEl.classList.add("next--info");
        previousInfoEl.classList.add("current--info");
        nextInfoEl.classList.add("previous--info");
    }
}
}

function swapInfoClassCards(direction){

}
function initCardEvents(){
    const currentCardEl = cardContainerEl.querySelector(".current--card");
    currentCardEl.addEventListener("pointermove", updateCard);
    currentCardEl.addEventListener("pointerout", (e) => {resetCardTransform(e)});
}
function updateCard(e){
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const centerPosition = {
        x: box.left + box.width / 2,
        y: box.top + box.height / 2,

    };
    let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
    gsap.set(card, {
        "--current-card-rotation-offset" : `${angle}deg`,
    });
   
    const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
    gsap.set(currentInfoEl, {
        rotateY: `${angle}deg`,
    });
}
function resetCardTransform(e){

}
function resetCardEvents(card){
    card.removeEventListener("pointermove", updateCard);
}
function init() {
    let tl = gsap.timeline();

    tl.to(cardContainerEl.children, {
        delay: 0.15,
        duration: 0.5,
        stagger: {
            ease: "power4.inOut",
            from: "right",
            amount: 0.1,
        }, "--card-translateY-offset": "0%",
    })
    .to(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
        delay: 0.5,
        duration: 0.4,
        stagger: 0.1,
        opacity: 1,
        translateY: 0
    })
    .to([buttons.prev, buttons.next], {
        duration: 0.4,
        opacity: 1,
        pointerEvents: "All",
    }, "-=0.4")

}
const waitForImage = () => {
    const images = [...document.querySelectorAll("img")];
    const totalImages = images.length;
    let loadedImages = 0;
    const loaderEl = document.querySelectorAll(".loader span");

    gsap.set(cardContainerEl.children, {
        "--card-translateY-offset": "1000vh",

    })

    gsap.set(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
        translateY: "40px",
        opacity: 0,
    });
    
    gsap.set([buttons.prev, buttons.next], {
        opacity: 0,
        pointerEvents: "none",
    })

    images.forEach((image) => {
        imagesLoaded(image, (instance) => {
            if (instance.isComplete) {
                loadedImages++;
                console.log("image loaded");
                let loadProgress = loadedImages / totalImages;

                gsap.to(loaderEl, {
                    duration: 2,
                    scaleX: loadProgress,
                    backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%)`,

                });

                if (totalImages == loadedImages) {
                    gsap.timeline()
                        .to(".loading__wrapper", {
                            delay: 2,
                            duration: 1,
                            opacity: 0,
                            pointerEvents: "none",
                        })
                        .call(() => init());
                }
            }
        });
    });
};

waitForImage();
