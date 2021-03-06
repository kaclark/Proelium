const STARTHEALTH = 50;
const STARTSTANIMA = 30;
const STARTMANA = 30;
const STARTHEALTHHARD = 75;
const STARTSTANIMAHARD = 45;
const STARTMANAHARD = 45;
const STARTHEALTHNIGHTMARE = 40;
const STARTSTANIMANIGHTMARE = 20;
const STARTMANAHARDNIGHTMARE = 20;
const DECKSIZE = 5;
const PUCNHDAMAGE = 5;
const PUNCHDRAIN = 2;
const KICKDAMAGE = 7;
const KICKDRAIN = 4;
const FIREBALLDAMAGE = 10;
const FIREBALLDRAIN = 15;
const HEALTHBOOST = -20;
const HEALDRAIN = 10;
const MULTIPLIERSCALER = 2;
const POISONSCALER = 0.5;
const FREEZEDAMAGE = 15;
const FREEZEDRAIN = 20;
const RESTBOOST = 15;
const LEECHTRANSFER = 10;
const LEECHDRAIN = 5;
const POISONDAMAGE = 5;
const POISONDRAIN = 3;
const SHOCKDAMAGE = 6;
const SHOCKDRAIN = 7;
const SHOCKSTUN = 1;
const MAGNETIZEDAMAGE = 20;
const MAGNETIZEDRAIN = 15;
const HIGHESTSTAMDRAIN = KICKDRAIN;
const HIGHESTMANADRAIN = FIREBALLDRAIN;

export var winner = "NONE";
export var reset = false;
var difficultySetting = "Normal";
export var currentFighter = null;
var moves = 0;
export var opponentDisabled = false;
var botMultiTurn = false;

function Fighter(name){
    this.name = name
    this.health = STARTHEALTH,
    this.stanima = STARTSTANIMA,
    this.mana = STARTMANA,
    this.enemey = function(opp){
        this.enemey = opp;
    },
    this.deck = [],
    this.cards = [],
    this.lastCard = null,
    this.scalar = 1;
    this.endOfTurn = 0;
    this.extraMoves = 0;
    this.screenMessage = "";
    this.namesCards = [];
    this.curCard;
    this.emult;
    this.mult;
}

function GameConstants(){
  this.punchDamage = PUCNHDAMAGE;
  this.punchDrain = PUNCHDRAIN;
  this.kickDamage = KICKDAMAGE;
  this.kickDrain = KICKDRAIN;
  this.fireballDamage = FIREBALLDAMAGE;
  this.fireballDrain = FIREBALLDRAIN;
  this.healthBoost = HEALTHBOOST;
  this.healDrain = HEALDRAIN;
  this.multiplierScaler = MULTIPLIERSCALER;
  this.poisonScaler = POISONSCALER;
  this.poisonDamage = POISONDAMAGE;
  this.poisonDrain = POISONDRAIN;
  this.freezeDamage = FREEZEDAMAGE;
  this.freezeDrain = FREEZEDRAIN;
  this.restBoost = RESTBOOST;
  this.leechTransfer = LEECHTRANSFER;
  this.leechDrain = LEECHDRAIN;
  this.shockDamage = SHOCKDAMAGE;
  this.shockDrain = SHOCKDRAIN;
  this.magnetDamage = MAGNETIZEDAMAGE;
  this.magnetDrain = MAGNETIZEDRAIN;
}

function generateCards(Fighter, num){
    var thisDeck = [];
    var maxNum = cardChars.length - 1;
    for(var i = 0; i < num; i++){
        thisDeck[i] = randomNum(0, maxNum);
        Fighter.cards[i] = cardChars[thisDeck[i]];
        Fighter.namesCards[i] = cardNames[thisDeck[i]]
    }
    Fighter.deck = thisDeck;
}

export function damage(Fighter, dam){
    Fighter.health = Math.round(Fighter.health - dam);
}

function manaUse(Fighter, drain){
    Fighter.mana = Math.round(Fighter.mana - drain);
}

function staminaUse(Fighter, drain){
    Fighter.stanima = Math.round(Fighter.stanima - drain);
}

var cardNames = [
    "Punch", "Punch","Punch", "Punch", "Punch", "Kick", "Kick", "Kick", "Kick", "Fireball", "Heal", "Rest", "Multiplier", "Poison", "Freeze", "Leech", "Combo", "Shock", "Magnetize"
]
var cardChars = [
    "P", "P","P", "P", "P", "K", "K", "K", "K", "F", "H", "R", "M", "Po", "Fr", "L", "C", "S", "Ma"
]

//PUT COMBO BACK IN
export function useCard(Fighter, placeInDeck){
    //USE THE CARD, GENERATE ANOTHER ONE, SET THE CARD TO THE NEW ONE
    if(reset){
      reset = false;
    }
    var using = Fighter.deck[placeInDeck];
    var opp = Fighter.enemey;
    var caster = Fighter;
    var stam = Fighter.stanima;
    var mana = Fighter.mana;
    caster.mult = false;
    var scal = Fighter.scalar;
    var combo = false;
    function enough(energy, demand){
        if(energy >= demand){
            return true;
        }else{
            return false;
        }
    }
    function partial(current, demand){
        return current / demand;
    }
    function punch(){
    if(enough(stam, PUNCHDRAIN)){
            damage(opp, PUCNHDAMAGE * scal);
            staminaUse(caster, PUNCHDRAIN);
        }else{
          if(stam > 0){
            damage(opp, PUCNHDAMAGE * scal * partial(stam, PUNCHDRAIN));
            staminaUse(caster, PUNCHDRAIN * partial(stam, PUNCHDRAIN));
          }else{
            staminaUse(caster, -PUNCHDRAIN * scal);
          }  
        } 
    }
    function kick(){
        if(enough(stam, KICKDRAIN)){
            damage(opp, KICKDAMAGE * scal); 
            staminaUse(caster, KICKDRAIN);
        }else{
          if(stam > 0){
           damage(opp, KICKDAMAGE * scal * partial(stam, KICKDRAIN)); 
            staminaUse(caster, KICKDRAIN  * partial(stam, KICKDRAIN));
          }else{
            staminaUse(caster, -KICKDRAIN * scal);
          }
 
        }
    }
    function fireball(){
    if(enough(mana, FIREBALLDRAIN)){
            damage(opp, FIREBALLDAMAGE * scal);
            manaUse(caster, FIREBALLDRAIN);
        }else{
          if(mana > 0){
            damage(opp, FIREBALLDAMAGE * scal * partial(mana, FIREBALLDRAIN));
            manaUse(caster, FIREBALLDRAIN * partial(mana, FIREBALLDRAIN));
          }else{
            manaUse(caster, -FIREBALLDRAIN * scal);
          }
        }
    }
    function heal(){
    if(enough(mana, HEALDRAIN)){
            damage(caster, HEALTHBOOST * scal);
            manaUse(caster, HEALDRAIN);
        }else{
          if(mana > 0){
            damage(caster, HEALTHBOOST * scal * partial(mana, HEALDRAIN));
            manaUse(caster, HEALDRAIN * partial(mana, HEALDRAIN));
          }else{
            manaUse(caster, -HEALDRAIN * scal);
          }
        } 
    }
    function freeze(){
        if(enough(mana, FREEZEDRAIN)){
          if(opp.stanima >= FREEZEDAMAGE * scal){
            staminaUse(opp, FREEZEDAMAGE * scal);
          }else{
            staminaUse(opp, opp.stanima);
          }
           manaUse(caster, FREEZEDRAIN);
        }else{
          if(mana > 0){
          if(opp.stanima >= FREEZEDAMAGE * scal * partial(mana, FREEZEDRAIN) ){
            staminaUse(opp, FREEZEDAMAGE * scal * partial(mana, FREEZEDRAIN));
            manaUse(caster, FREEZEDRAIN * scal * partial(mana, FREEZEDRAIN));
          }else{
            staminaUse(opp, opp.stanima);
          }
          }else{
            manaUse(caster, -FREEZEDRAIN * scal);
          }
        } 
    }
    function leech(){
      if(enough(mana, LEECHDRAIN)){
        damage(opp, LEECHTRANSFER * scal);
        damage(caster, -LEECHTRANSFER * scal);
        manaUse(caster, LEECHDRAIN);
      }else{
        if(mana > 0){
            damage(opp, LEECHTRANSFER * scal * partial(mana, LEECHDRAIN))
            damage(caster, LEECHTRANSFER * scal * partial(mana, LEECHDRAIN));
            manaUse(caster, LEECHDRAIN * partial(mana, LEECHDRAIN));
        }else{
          manaUse(caster, -LEECHDRAIN * scal);
        }
      }
    }

    function poison(){
      if(enough(mana, POISONDRAIN)){
        damage(opp, POISONDAMAGE * scal);
        manaUse(caster, POISONDRAIN);
        opp.scalar = POISONSCALER * scal * opp.scalar;
        opp.emult = true;
      }else{
        if(mana > 0){
            damage(opp, POISONDAMAGE * scal * partial(mana, POISONDRAIN))
            manaUse(caster, POISONDRAIN * partial(mana, POISONDRAIN));
            opp.scalar = POISONSCALER * scal * opp.scalar * partial(mana, POISONDRAIN);
            opp.emult = true;
        }else{
          manaUse(caster, -POISONDRAIN * scal);
        }
      }
    }
    function shock(){
      if(enough(mana, SHOCKDRAIN)){
        damage(opp, SHOCKDAMAGE * scal);
        manaUse(caster, SHOCKDRAIN);
        Fighter.extraMoves = (SHOCKSTUN * scal) + Fighter.extraMoves;
        Fighter.endOfTurn = moves + 1 + (SHOCKSTUN * scal) + Fighter.extraMoves;
        if(currentFighter === Fighter1){
          Fighter2.screenMessage = "";
        }
        opponentDisabled = true;
      }else{
        damage(opp, SHOCKDAMAGE * scal * partial(mana, SHOCKDRAIN))
        manaUse(caster, SHOCKDRAIN * partial(mana, SHOCKDRAIN));
      }
    }
    function magnetize(){
      if(enough(mana, MAGNETIZEDRAIN)){
        if(opp.mana >= MAGNETIZEDAMAGE * scal){
          manaUse(opp, MAGNETIZEDAMAGE * scal);
        }else{
          manaUse(opp, opp.mana);
        }
         manaUse(caster, MAGNETIZEDRAIN);
      }else{
        if(mana > 0){
        if(opp.stanima >= MAGNETIZEDAMAGE * scal * partial(mana, MAGNETIZEDRAIN) ){
          manaUse(opp, MAGNETIZEDAMAGE * scal * partial(mana, MAGNETIZEDRAIN));
          manaUse(caster, MAGNETIZEDRAIN * scal * partial(mana, MAGNETIZEDRAIN));
        }else{
          manaUse(opp, opp.mana);
        }
        }else{
          manaUse(caster, -MAGNETIZEDRAIN * scal);
        }
      }     
    }
    switch(using){
        case 0: //Punch
        punch();
        break;
        case 1: //Punch
        punch();
        break;
        case 2: //Punch
        punch(); 
        break;
        case 3: //Punch
        punch();
        break;
        case 4: //Punch
        punch();
        break;
        case 5: //Kick
        kick();
        break;
        case 6: //Kick
        kick();
        break;  
        case 7: //Kick
        kick();
        break;  
        case 8: //Kick
        kick();
        break; 
        case 9: //Fireball
        fireball();
        break;
        case 10: //Heal
        heal();
        break;
        case 11: //Rest
        staminaUse(caster, -RESTBOOST * scal);
        manaUse(caster, -RESTBOOST * scal);
        break; 
        case 12: //Mult
        caster.scalar = MULTIPLIERSCALER * scal;
        caster.mult = true;
        break;
        case 13: //Poison
        poison();
        break;
        case 14:
        freeze();
        break;
        case 15:
        leech();
        break;
        case 16:
        Fighter.extraMoves = (2 * scal) + Fighter.extraMoves;
        Fighter.endOfTurn = moves + 1 + (2 * scal) + Fighter.extraMoves;
        if(currentFighter === Fighter1){
          Fighter2.screenMessage = "";
        }
        if(currentFighter === Fighter2){
          botMultiTurn = true;
        }
        opponentDisabled = true;
        break;
        case 17:
        shock();
        if(currentFighter === Fighter2){
          botMultiTurn = true;
        }
        break;
        case 18:
        magnetize();
        break;
    }
    Fighter.lastCard = Fighter.cards[placeInDeck];
    Fighter.curCard = Fighter.namesCards[placeInDeck];
    var numMax = cardChars.length - 1;
    var newCard = randomNum(0, numMax)
    Fighter.deck[placeInDeck] = newCard;
    Fighter.cards[placeInDeck] = cardChars[newCard];
    Fighter.namesCards[placeInDeck] = cardNames[newCard];
    if(!caster.mult){
        caster.scalar = 1;
    }
    if(!caster.emult){
      caster.scaler = 1;
    }
    if(Fighter.extraMoves > 0){
      Fighter.extraMoves -= 1;
    }else{
      Fighter.endOfTurn = moves + 1;
    }
    moves++;
    getNextFighter();
}

export function burnCard(Fighter, placeInDeck){

    var using = Fighter.deck[placeInDeck];
    var caster = Fighter;
    var stam = Fighter.stanima;
    var mana = Fighter.mana;
    var scal = Fighter.scalar;
    var opp = Fighter.enemey;
    
    function punch(){
      staminaUse(caster, -PUNCHDRAIN * scal);
    }
    function kick(){
       staminaUse(caster, -KICKDRAIN * scal);
    }
    function fireball(){
      manaUse(caster, -FIREBALLDRAIN * scal);
    }
    function heal(){
        manaUse(caster, -HEALDRAIN * scal);
    }
    function freeze(){
        manaUse(caster, -FREEZEDRAIN * scal);
    }
    function leech(){
      manaUse(caster, -LEECHDRAIN * scal);
    }
    function poison(){
      manaUse(caster, -POISONDRAIN * scal);
    }
    function shock(){
      manaUse(caster, -SHOCKDRAIN * scal);
    }
    function magnetize(){
      manaUse(caster, -MAGNETIZEDRAIN * scal);
    }
    switch(using){
       case 0: //Punch
        punch();
        break;
        case 1: //Punch
        punch();
        break;
        case 2: //Punch
        punch(); 
        break;
        case 3: //Punch
        punch();
        break;
        case 4: //Punch
        punch();
        break;
        case 5: //Kick
        kick();
        break;
        case 6: //Kick
        kick();
        break;  
        case 7: //Kick
        kick();
        break;  
        case 8: //Kick
        kick();
        break; 
        case 9: //Fireball
        fireball();
        break;
        case 10: //Heal
        heal();
        break;
        case 11: //Rest
        staminaUse(caster, -RESTBOOST * scal);
        manaUse(caster, -RESTBOOST * scal);
        break; 
        case 12: //Mult
        caster.scalar = MULTIPLIERSCALER * scal;
        caster.mult = true;
        break;
        case 13: //Poison
        poison();
        break;
        case 14:
        freeze();
        break;
        case 15:
        leech();
        break;
        case 16:
        Fighter.extraMoves = (2 * scal) + Fighter.extraMoves;
        Fighter.endOfTurn = moves + 1 + (2 * scal) + Fighter.extraMoves;
        if(currentFighter === Fighter1){
          Fighter2.screenMessage = "";
        }
        opponentDisabled = true;
        break;
        case 17:
        shock();
        break;
        case 18:
        magnetize();
        break;
    }
    Fighter.lastCard = Fighter.cards[placeInDeck];
    Fighter.curCard = Fighter.namesCards[placeInDeck];
    var numMax = cardChars.length - 1;
    var newCard = randomNum(0, numMax)
    Fighter.deck[placeInDeck] = newCard;
    Fighter.cards[placeInDeck] = cardChars[newCard];
    Fighter.namesCards[placeInDeck] = cardNames[newCard];
    if(!caster.mult){
        caster.scalar = 1;
    }
    if(!caster.emult){
      caster.scaler = 1;
    }
    moves++;
    getNextFighter();
}

export function randomNum(min, max) {//MAX INCLUDED
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

export function gameOver(f1, f2){
    if (f1.health <= 0){
        winner = f2.name;
    }else if(f2.health <= 0){
        winner = f1.name;
    }
    if(winner == f1.name || winner == f2.name){
        return true;
    }else{
        return false;
    }

}

export function bot(){
  if(currentFighter === Fighter2){
  opponentDisabled = false;
  if(!(difficultySetting === "Easy")){
    smartBot();
  }else{
     useCard(Fighter2, randomNum(0, DECKSIZE - 1));
  }

  if(!gameOver(Fighter1, Fighter2) && !opponentDisabled){
    if(!botMultiTurn){
      Fighter2.screenMessage = "Opponent has cast " + Fighter2.curCard;
    }else{
      Fighter2.screenMessage = "Opponent has cast multiple cards";
    }

  }else{
  Fighter2.screenMessage = "";
  }
  moves++;
  }
  if(currentFighter === Fighter2){
    botMultiTurn = true;
    bot();
  }
}

function smartBot(){

    var bot = Fighter2;
    var mana = Fighter2.mana;
    var stanima = Fighter2.stanima;
    var cardUsed = false;
    
    while(!cardUsed){//Ensures that only one card is selected

      //If opponent is vulnerable, deliver killshot with kick
      for(var i = 0; i < Fighter2.DECKSIZE; i++){
        if((bot.opp.health <= KICKDAMAGE) && (bot.cards[i] === "K") &&(stanima >= KICKDRAIN)){
          useCard(Fighter2, i);
          cardUsed = true;
        }
      }
    
      //If opponent is vulnerable, deliver killshot with punch
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if((bot.opp.health <= PUCNHDAMAGE) && (bot.cards[i] === "P") &&(stanima >= PUNCHDRAIN)){
          useCard(Fighter2, i);
          cardUsed = true;
        }
      }
    
      //If opponent casts multiplier, counter with poison
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if((bot.opp.lastCard === "M") && (bot.cards[i] === "Po")){
          useCard(Fighter2, i);
          cardUsed = true;
        }
      }

      //If health is getting low, use heal
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if((bot.health <= 20) && (bot.cards[i] === "H")){
          useCard(Fighter2, i);
          cardUsed = true;
        }
      }

      //use multiplier if available
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if(bot.cards[i] === "M"){
          useCard(Fighter2, i);
          cardUsed = true;
        }
      }
      //use combo 
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if(bot.cards[i] === "C"){
          useCard(Fighter2, i);
          cardUsed = true;
        }
      }

      //if mana affords and is avaiable, cast shock
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if(bot.cards[i] === "S"){
          useCard(Fighter2, i);
          cardUsed = true;
        }
      }

      //if mana affords and is avaiable, cast heal
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if((bot.cards[i] === "H") && (mana >= HEALDRAIN)){
          useCard(Fighter2, i);
          cardUsed = true;
        }
      }
      //if mana affords and is available, cast magnetize
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if((mana >= MAGNETIZEDRAIN) && (bot.cards[i] === "Ma")){
          useCard(Fighter2, i);
          cardUsed = true;
        }
      }
      //if mana affords and is avaiable, cast freeze
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if((mana >= FREEZEDRAIN) && (bot.cards[i] === "Fr")){
          useCard(Fighter2, i);
          cardUsed = true;
        }
      }

      //if mana affords and is avaiable, cast fireball
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if((mana >= FIREBALLDRAIN) && (bot.cards[i] === "F")){
          useCard(Fighter2, i);
          cardUsed = true;
        }
      }

      //if stanima affords and is avaiable, cast punch
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if((stanima >= PUNCHDRAIN) && (bot.cards[i] === "P")){
          useCard(Fighter2, i);
          cardUsed = true;
       }
      }

      //if stanima affords and is avaiable, cast kick
      for(i = 0; i < Fighter2.DECKSIZE; i++){
       if((stanima >= KICKDRAIN) && (bot.cards[i] === "K")){
          useCard(Fighter2, i);
          cardUsed = true;
       }
      }

      //if neither mana or stanima are not high enough to cast the most demanding card, use rest
      for(i = 0; i < Fighter2.DECKSIZE; i++){
        if((stanima <= HIGHESTMANADRAIN) || (mana <= HIGHESTMANADRAIN) && (bot.cards[i] === "R")){
          useCard(Fighter2, i);
          cardUsed = true;
       }
      } 

      //in the event that none of the above conditions are met, select a card at random from the hand
        useCard(Fighter2, randomNum(0, DECKSIZE - 1));
        cardUsed = true;
    }
}
export function getNextFighter(){
  if(currentFighter === null){
      var coinFlip = randomNum(0, 1);
      if(coinFlip == 1){
          currentFighter = Fighter1;
          opponentDisabled = false;
          botMultiTurn = false;
          return Fighter1;
      }else if(coinFlip == 0){
          currentFighter = Fighter2;
          opponentDisabled = false;
          return Fighter2;
      }
  }else{
      if(currentFighter.endOfTurn === moves){
          if(currentFighter === Fighter1){
              currentFighter = Fighter2;
              opponentDisabled = false;
              return Fighter2; 
          }else if(currentFighter === Fighter2){
              currentFighter = Fighter1;
              botMultiTurn = false;
              return Fighter1;
          }else{
              currentFighter = null;
              getNextFighter();
          }
      }else{
          return currentFighter;
      }
  
  }
}
export function setDifficulty(difficulty){
  difficultySetting = difficulty;
}

export function getDifficulty(){
  return difficultySetting;
}

export function resetGame(){
  currentFighter = null;
  getNextFighter();
  if(!((difficultySetting === "Hard") || (difficultySetting === "Nightmare"))){
  Fighter2.health = STARTHEALTH;
  Fighter2.stanima = STARTSTANIMA;
  Fighter2.mana = STARTMANA;
  }else{
  Fighter2.health = STARTHEALTHHARD;
  Fighter2.stanima = STARTSTANIMAHARD;
  Fighter2.mana = STARTMANAHARD;
  }
  if(!(difficultySetting === "Nightmare")){
  Fighter1.health = STARTHEALTH;
  Fighter1.stanima = STARTSTANIMA;
  Fighter1.mana = STARTMANA;
  }else{
  Fighter1.health = STARTHEALTHNIGHTMARE;
  Fighter1.stanima = STARTSTANIMANIGHTMARE;
  Fighter1.mana = STARTMANAHARDNIGHTMARE
  }
  Fighter1.scalar = 1;
  Fighter2.scalar = 1;
  generateCards(Fighter1, 5);
  generateCards(Fighter2, 5);
  winner = null;
  Fighter2.screenMessage = "";
  reset = true;
}

export var Fighter1 = new Fighter("Fighter1");
export var Fighter2 = new Fighter("Fighter2");
Fighter1.enemey(Fighter2);
Fighter2.enemey(Fighter1);
generateCards(Fighter1, 5);
generateCards(Fighter2, 5);
getNextFighter();
export var GameConsts = new GameConstants();