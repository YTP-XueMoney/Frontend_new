import './style.css';
import './reset.css';
import * as monaco from "monaco-editor";
import { rotateMatrix } from "./tools.js";
let ani_lines=[];
function isProxy(obj) {
  if (typeof obj != "object") return false;
  return obj.isProxy;
}

window.onload = () => {
  const code_editor = document.getElementById("code-editor");
  const input_area = document.getElementById("input-area");
  const output_area = document.getElementById("output-area");
  const input_btn = document.querySelector('#input-area-btn');
  const output_btn = document.querySelector('#output-area-btn');

  const input = () => {
    return input_monaco.getValue();
  };

  const output = (str) => {
    output_area.querySelector('#output-txt').innerHTML += str;
  }

  const code_monaco = monaco.editor.create(code_editor, {
    value: "output(input() + ', hello world.')\nlet mySegTree = new pack_segTree(13, 600, 40);",
    language: "javascript",
    theme: "vs-light",
    minimap: { enabled: false },
    automaticLayout: true,
  });

  const input_monaco = monaco.editor.create(input_area, {
    value: "",
    language: "plaintext",
    theme: "vs-light",
    minimap: { enabled: false },
    automaticLayout: false,
    lineNumbers: "off",        // 關閉行號
    glyphMargin: false,        // 移除左側行數間距
    folding: false,            // 移除程式碼折疊功能（避免留白）
    lineDecorationsWidth: 5,   // 移除行裝飾欄位
    lineNumbersMinChars: 0     // 確保行數欄位不佔空間
  });

  document.querySelector('#run').addEventListener('click', () => {
    let runcode = code_monaco.getValue();
    ani_lines=[]
    output_area.querySelector('#output-txt').innerHTML = '';
    svg.innerHTML = '';
    eval(runcode);
    input_area.style.display = "none";
    output_area.style.display = "block";
    output_btn.classList.add("active-btn");
    input_btn.classList.remove("active-btn");
  });
  document.querySelector('#show').addEventListener('click', () => {
    console.log(ani_lines);
  });
  document.querySelector("#play").addEventListener("click", () => {
    
    let all_line=ani_lines.length;
    async function executeNextLine() {
      for(let i=0;i<all_line;i++){
        console.log(`執行 ${i} , ${ani_lines[i]}`);
        let code_to_run=ani_lines.slice(0, i+1).join("\n");
        await new Promise(resolve => setTimeout(resolve, 500));
        document.getElementById("mySvg").innerHTML = "";
        eval(code_to_run);
      }
      ani_lines=[]
    }
  
    executeNextLine(); // 開始執行第一行
    
  });
  input_area.style.display = "block";
  output_area.style.display = "none"; // 預設隱藏 output-area

  input_btn.classList.add("active-btn");

  // 按鈕切換

  document.querySelector('#input-area-btn').addEventListener("click", () => {
    input_area.style.display = "block";
    output_area.style.display = "none";
    input_btn.classList.add("active-btn");
    output_btn.classList.remove("active-btn");
  });

  document.querySelector('#output-area-btn').addEventListener("click", () => {
    input_area.style.display = "none";
    output_area.style.display = "block";
    output_btn.classList.add("active-btn");
    input_btn.classList.remove("active-btn");
  });

};

class Debugger {
  constructor(codeLines) {
      this.codeLines = codeLines;
      this.currentLine = 0;
  }

  nextStep() {
      if (this.currentLine >= this.codeLines.length) {
          console.log("🎯 所有代碼執行完成！");
          return;
      }

      let line = this.codeLines[this.currentLine];
      console.log(`🛑 執行第 ${this.currentLine + 1} 行: ${line}`);
      this.currentLine++;

      eval(line);  // 執行該行代碼
  }
}

// 取得 SVG 容器
var svg = document.getElementById("mySvg");
var svgNull = document.createElementNS("http://www.w3.org/2000/svg", "circle");
svgNull.setAttribute("r", 0);

let frameT = 35;

let time = {
  prevFrame: Date.now(),
  curFrame: Date.now(),
  // deltaFrame: this.prevFrame - this.curFrame,
  deltaFrame: 0,
  delta: 0 / 1000,
};

let mouse = {
  x: 0,
  y: 0,
  lastX: 0,
  lastY: 0,
  dX: 0,
  dY: 0,
  hold: false,
};

export function updateLoop(self) {
  if ("$deleted" in self && self.$deleted) return;
  setTimeout(() => {
    self.update();
  }, frameT);
}

export function DelegationHandler(delegaionNames) {
  return {
    get(target, prop, receiver) {
      //  can't find a better way to determine if an object is a proxy
      //  there's node: util.types.isProxy but it's not available in browser
      if (prop == "isProxy") return true;

      if (prop in target) return Reflect.get(target, prop);
      else {
        for (let name of delegaionNames) {
          let nextTarget = target[name];
          if (isProxy(nextTarget) || prop in nextTarget) {
            let result = Reflect.get(nextTarget, prop);
            if (result != undefined) return result;
          }
        }
        return undefined;
      }
    },
    set(target, prop, value) {
      if (prop in target) return Reflect.set(target, prop, value);
      else {
        for (let name of delegaionNames) {
          if (
            (isProxy(target[name]) || prop in target[name]) &&
            Reflect.set(target[name], prop, value)
          )
            return true;
        }
        return false;
      }
    },
  };
}

export function Delegation(target, delegaionNames) {
  for (let prop of delegaionNames)
    if (!(prop in target)) throw Error(`${prop} doesn't exist in ${target}`);
  // else if (typeof target[prop] != "object")
  //   throw Error(`${prop} in ${target} isn't an object`);
  return new Proxy(target, DelegationHandler(delegaionNames));
}

// export function DelegationHandler(delegaionName) {
//   return {
//     get(target, prop, receiver) {
//       // 如果 `prop` 存在於 Pointer 自身，返回它
//       if (prop in target) return target[prop];
//       // 否則將屬性存取轉發到 `val`
//       return target[delegaionName][prop];
//     },
//     set(target, prop, value) {
//       if (prop in target) target[prop] = value;
//       else target[delegaionName][prop] = value;
//       return true;
//       //  idk why
//     },
//   };
// }

export class pointer {
  pointer_isPointer = true;
  _val;
  constructor(val = 0) {
    this._val = val;
    return Delegation(this, ["val"]);
  }
  valueOf() {
    return this.val;
  }
  get val() {
    // if (this._val != null && this._val.pointer_isPointer) return this._val.val;
    if (
      this._val != null &&
      (this._val.constructor.name == "pointer" ||
        this._val.constructor.name == "refer")
    )
      return this._val.val;
    else return this._val;
  }
  set val(val) {
    // if (this._val.pointer_isPointer) this._val.val = val;
    if (
      this._val.constructor.name == "pointer" ||
      this._val.constructor.name == "refer"
    )
      this._val.val = val;
    else {
      if (val !== this) this._val = val;
      else {
        console.error(
          "can't define a pointer's final target to itself",
          this,
          val,
          this == val
        );
      }
    }
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "number") {
      // console.log(this.valueOf());
      return this.valueOf();
    }
    if (hint === "string") {
      return toString(this.valueOf());
    }
    return this.valueOf();
  }
}

export class refer {
  getFunc;
  setFunc;
  pointer_isPointer = true;
  constructor(getFunc, setFunc = null) {
    this.getFunc = getFunc;
    this.setFunc = setFunc;
  }
  get val() {
    // return this.getFunc();
    let ret = new pointer(this.getFunc());
    return ret.val;
  }
  set val(val) {
    //  nothing happen right now
    if (this.setFunc != null) this.setFunc(val);
    // else console.error("this refer has no set/reverse funuction");
    // console.log("tried to change a refer val");
  }
  valueOf() {
    return this.val;
  }
}

export class svg_AttributeSetter {
  svg = new pointer();
  att = new pointer();
  val = new pointer();
  constructor(svg, att, val) {
    this.svg._val = svg;
    this.att._val = att;
    this.val._val = val;
  }
  update() {
    // if (this.att == "transform") console.log(this.val.val);
    this.svg.val.setAttribute(this.att.val, this.val.val);
  }
}

let svg_AS = svg_AttributeSetter;

export class svg_AttributeSetterArray {
  svgASA = [];
  _svg;

  set svg(svg) {
    for (let svgAS of this.svgASA) svgAS.svg = svg;
    this._svg = svg;
    // console.log("set");
  }
  get svg() {
    return this._svg;
  }

  append(svg, att, val) {
    this.svgASA.push(new svg_AS(svg, att, val));
  }
  update() {
    for (let i = 0; i < this.svgASA.length; i++) this.svgASA[i].update();
  }
}

let svg_ASA = svg_AttributeSetterArray;

export class Coordinate2d {
  x = new pointer(0);
  y = new pointer(0);

  constructor(_x = 0, _y = 0) {
    this.x.val = _x;
    this.y.val = _y;
  }
  distance(other) {
    return Math.sqrt(
      Math.pow(this.x.val - other.x.val, 2) +
        Math.pow(this.y.val - other.y.val, 2)
    );
  }

  dist(other) {
    return this.distance(other);
  }

  len() {
    return Math.sqrt(this.x.val * this.x.val + this.y.val * this.y.val);
  }

  static distance(a, b) {
    return Math.sqrt(
      Math.pow(a.x.val - b.x.val, 2) + Math.pow(a.y.val - b.y.val, 2)
    );
  }

  static dist(a, b) {
    return this.distance(a, b);
  }

  static len(a) {
    return a.x.val * a.x.val + a.y.val * a.y.val;
  }

  static unit(me) {
    var r = Math.sqrt(me.x.val * me.x.val + me.y.val * me.y.val);
    return new Coordinate2d(me.x.val / r, me.y.val / r);
  }
}

export class obj_Dot {
  pos = new Coordinate2d();
  velocity = new Coordinate2d();
  constructor(_x = 0, _y = 0, _vx = 0, _vy = 0) {
    this.pos.x.val = _x;
    this.pos.y.val = _y;
    this.velocity.x.val = _vx;
    this.velocity.y.val = _vy;
    this.update();
  }
  update() {
    this.pos.x.val += this.velocity.x.val * time.delta;
    this.pos.y.val += this.velocity.y.val * time.delta;
    updateLoop(this);
  }
}

export class obj_Circle {
  dot = new obj_Dot();
  pos = dot.pos;
  velocity = dot.velocity;
  r = 0;
  constructor(_x = 0, _y = 0, _r = 0) {
    dot = obj_Dot(_x, _y);
    r = _r;
  }
}

export class obj_Box {
  dot = new obj_Dot();
  pos = this.dot.pos;

  height = new pointer();
  width = new pointer();
  constructor(_height = 1000, _width = 1000, _x = 0, _y = 0) {
    this.height.val = _height;
    this.width.val = _width;
    this.pos.x.val = _x;
    this.pos.y.val = _y;
    this.update();
  }

  append(newObj) {
    this.containing.push(newObj);
  }

  containing = [];
  update() {
    var up = this.pos.y.val - this.height.val;
    var down = this.pos.y.val + this.height.val;
    var left = this.pos.x.val - this.width.val;
    var right = this.pos.x.val + this.width.val;
    for (var i = 0; i < this.containing.length; i++) {
      let curObj = this.containing[i];
      let r = 0;
      if (curObj.r != null) r = curObj.r;
      if (curObj.pos.y.val < up + r) {
        curObj.pos.y.val = up + r;
        curObj.velocity.y.val = 0;
      }
      if (curObj.pos.y.val > down - r) {
        curObj.pos.y.val = down - r;
        curObj.velocity.y.val = 0;
      }
      if (curObj.pos.x.val < left + r) {
        curObj.pos.x.val = left + r;
        curObj.velocity.x.val *= -1;
      }
      if (curObj.pos.x.val > right - r) {
        curObj.pos.x.val = right - r;
        curObj.velocity.x.val *= -1;
      }
    }

    updateLoop(this);
    // idk why not setTimeout(this.update, frameT);
  }
}

export class obj_Gravity {
  k = new pointer(1);
  constructor(_k) {
    this.k = _k;
    this.update();
  }
  containing = [];

  append(newObj) {
    this.containing.push(newObj);
  }

  update() {
    for (var i = 0; i < this.containing.length; i++)
      for (var j = i + 1; j < this.containing.length; j++) {
        let curObj1 = this.containing[i];
        let curObj2 = this.containing[j];
        let posVector = new Coordinate2d(
          curObj2.pos.x - curObj1.pos.x,
          curObj2.pos.y - curObj1.pos.y
        );
        let r2 = Math.pow(posVector.len(), 1);
        posVector = Coordinate2d.unit(posVector);
        curObj1.velocity.x.val += (posVector.x.val * this.k * time.delta) / r2;
        curObj1.velocity.y.val += (posVector.y.val * this.k * time.delta) / r2;
        curObj2.velocity.x.val -= (posVector.x.val * this.k * time.delta) / r2;
        curObj2.velocity.y.val -= (posVector.y.val * this.k * time.delta) / r2;
      }
    updateLoop(this);
  }
}

export class obj_break {
  maxV = new pointer(10);
  break = new pointer(1.0);
  constructor(_break = 1.0, _maxV = 10) {
    this.break.val = _break;
    this.maxV.val = _maxV;
    this.update();
  }

  containing = [];
  append(newObj) {
    this.containing.push(newObj);
  }
  update() {
    for (var i = 0; i < this.containing.length; i++) {
      var curObj = this.containing[i];
      var velocity = curObj.velocity.len();
      var vX = curObj.velocity.x;
      var vY = curObj.velocity.y;
      vX.val -= (vX.val / velocity) * time.delta * 2;
      vY.val -= (vY.val / velocity) * time.delta * 2;
      vX.val *= Math.pow(this.break, time.delta);
      vY.val *= Math.pow(this.break, time.delta);
      if (velocity > this.maxV) {
        curObj.velocity.x.val /= velocity / this.maxV;
        curObj.velocity.y.val /= velocity / this.maxV;
      }
    }
    updateLoop(this);
  }
}

export class obj_repulsion {
  k = new pointer(10);
  r = new pointer(50);
  constructor(_k = 10, _r = 50) {
    this.k.val = _k;
    this.r.val = _r;
    this.update();
  }

  containing = [];
  append(newObj) {
    this.containing.push(newObj);
  }
  update() {
    for (var i = 0; i < this.containing.length; i++)
      for (var j = i + 1; j < this.containing.length; j++) {
        let curObj1 = this.containing[i];
        let curObj2 = this.containing[j];
        let posVector = new Coordinate2d(
          curObj2.pos.x - curObj1.pos.x,
          curObj2.pos.y - curObj1.pos.y
        );
        let d = posVector.len();
        let r2 = Math.pow(posVector.len(), 1);
        posVector = Coordinate2d.unit(posVector);
        if (d <= this.r) {
          curObj1.velocity.x.val -=
            (posVector.x.val * this.k * time.delta) / r2;
          curObj1.velocity.y.val -=
            (posVector.y.val * this.k * time.delta) / r2;
          curObj2.velocity.x.val +=
            (posVector.x.val * this.k * time.delta) / r2;
          curObj2.velocity.y.val +=
            (posVector.y.val * this.k * time.delta) / r2;
        }
      }
    updateLoop(this);
  }
}

export class obj_array {
  dot = new obj_Dot();
  pos = this.dot.pos;
  gap = new pointer(50);
  rad = new pointer(0);
  constructor(
    _x = pointer(0),
    _y = pointer(0),
    _gap = pointer(50),
    _rad = pointer(0)
  ) {
    this.pos.x = _x;
    this.pos.y = _y;
    this.gap = _gap;
    this.rad = _rad;
    this.update();
  }
  refers = [];
  containing = [];

  append(newObject, index) {
    this.containing.push({ obj: newObject, index: index });
  }

  update() {
    for (var i = 0; i < this.containing.length; i++) {
      var obj = this.containing[i].obj;
      var index = this.containing[i].index;
      var xy = rotateMatrix(
        this.pos.x + index * this.gap,
        this.pos.y,
        this.rad,
        this.pos.x,
        this.pos.y
      );
      obj.x.val = xy.x;
      obj.y.val = xy.y;
    }
    updateLoop(this);
  }
}

export class obj_bound {
  obj1 = new pointer();
  obj2 = new pointer();
  minr = new pointer();
  maxr = new pointer();
  k = new pointer();
  constructor(obj1, obj2, minr = null, maxr = null, k = 1000) {
    this.obj1._val = obj1;
    this.obj2._val = obj2;
    // if (typeof minr === "number") minr = new pointer(minr);
    this.minr._val = minr;
    // if (typeof maxr === "number") maxr = new pointer(maxr);
    this.maxr._val = maxr;
    // if (typeof maxr === "number") maxr = new pointer(maxr);
    this.k._val = k;
    this.update();
  }
  update() {
    let obj1 = this.obj1;
    let obj2 = this.obj2;
    let pos1 = obj1.pos;
    let pos2 = obj2.pos;
    // console.log(obj1);
    // console.log(obj2);

    let posVector = new Coordinate2d(pos2.x - pos1.x, pos2.y - pos1.y);
    let d = posVector.len();
    posVector = Coordinate2d.unit(posVector);
    if (d < this.minr) {
      let move = Math.min(this.minr - d, this.k * time.delta);
      move = (this.minr - d) / 1.5;
      pos1.x.val -= (posVector.x.val * move) / 2;
      pos1.y.val -= (posVector.y.val * move) / 2;
      pos2.x.val += (posVector.x.val * move) / 2;
      pos2.y.val += (posVector.y.val * move) / 2;
      obj1.dot.velocity.x.val *= 0.5;
      obj1.dot.velocity.y.val *= 0.5;
      obj2.dot.velocity.x.val *= 0.5;
      obj2.dot.velocity.y.val *= 0.5;
    }
    if (d > this.maxr) {
      let move = Math.min(d - this.maxr, this.k * time.delta);
      move = (d - this.maxr) / 1.5;
      pos1.x.val += (posVector.x.val * move) / 2;
      pos1.y.val += (posVector.y.val * move) / 2;
      pos2.x.val -= (posVector.x.val * move) / 2;
      pos2.y.val -= (posVector.y.val * move) / 2;
      obj1.dot.velocity.x.val *= 0.5;
      obj1.dot.velocity.y.val *= 0.5;
      obj2.dot.velocity.x.val *= 0.5;
      obj2.dot.velocity.y.val *= 0.5;
    }
    updateLoop(this);
  }
}

export class svg_bridge {
  _svgObj = new pointer(null);
  get svgObj() {
    return this._svgObj;
  }
  set svgObj(val) {
    if (this._svgObj.val != null) svg.removeChild(this._svgObj.val);
    this._svgObj._val = val;
    if (this._svgObj.val != null) {
      // this._svgObj.val.obj = this;
      this.svgASA.svg = this.svgObj;
      svg.appendChild(this._svgObj.val);
    }
  }
  constructor(svgObj = null) {
    this.svgObj = svgObj;
    return Delegation(this, ["svgObj"]);
    // return new Proxy(this, {
    //   get(target, prop) {
    //     if (prop in target) return target[prop];
    //     else return target.svgObj[prop];
    //   },
    // });
  }
  svgASA = new svg_ASA();
  addAttribute(att, val) {
    Reflect.defineProperty(this, att, val);
    // this[att] = val;
    this.svgASA.append(new pointer(this.svgObj), att, val);
  }
  setAttribute(att, val) {
    this._svgObj.val.setAttribute(att, val);
  }
  getAttribute(att) {
    return this.svgObj.val.getAttribute(att);
  }
  addEventListener(eventType, func) {
    this._svgObj.val.addEventListener(eventType, func);
  }
  update() {
    this.svgASA.update();
  }
}

export class svg_hold {
  //  under svg_bridge
  svgBridge = new pointer(); // svg_bridge
  curSvgObj = new pointer();
  holding = false;
  pos = new pointer();
  dX;
  dY;
  $deleted = false;

  constructor(svgBridge, pos) {
    this.svgBridge._val = svgBridge;
    this.curSvgObj._val = svgBridge.svgObj;
    this.pos._val = pos;
    // console.log(this.curSvgObj);
    this.curSvgObj.val.addEventListener(
        "mousedown",
        this.triggerFunction.bind(this),
      );
    
    //  idfk why this doesn't work
    // this.curSvgObj.addEventListener(
      //   "mousedown",
      //   this.triggerFunction.bind(this),
      // );

    // alternative:
    // let tmpF = this.curSvgObj.addEventListener;
    // tmpF("mousedown", this.triggerFunction.bind(this));

    // fix this if have time

    this.update();
  }
  triggerFunction(event) {
    if (this.$deleted) return;
    event.preventDefault();
    this.holding = true;
    this.dX = this.svgBridge.getAttribute("cx") - mouse.x;
    this.dY = this.svgBridge.getAttribute("cy") - mouse.y;
    svg.appendChild(this.svgBridge.svgObj.val);
    // console.log(`dx: ${this.dX}, dy: ${this.dY}`);
    // console.log(this.svgBridge);
  }
  update() {
    if (this.svgBridge.val.svgObj.val !== this.curSvgObj) {
      this.curSvgObj.val.removeEventListener(
        "mousedown",
        this.triggerFunction.bind(this)
      );
      this.curSvgObj._val = this.svgBridge.svgObj.val;
      this.curSvgObj.val.addEventListener(
        "mousedown",
        this.triggerFunction.bind(this)
      );
    }
    if (this.holding) {
      this.pos.x.val = this.dX + mouse.x;
      this.pos.y.val = this.dY + mouse.y;
      if (!mouse.hold) {
        svg_layerSortTrigger = true;
        this.holding = false;
      }
    }
    updateLoop(this);
  }
  delete() {
    this.$deleted = true;
    this.curSvgObj.val.removeEventListener(
      "mousedown",
      this.triggerFunction.bind(this)
    );
  }
}

let svg_layerSortTrigger = false;

export class svg_layer {
  svgObj; // svg_bridge
  _layer = new pointer(0);
  constructor(svgObj, layer) {
    this.svgObj = svgObj;
    this.layer = layer;
    // this.svgObj.layer = this.layer;
    // this.svgObj.addAttribute("layer", this._layer);
    // this.update();
  }
  get layer() {
    return this._layer;
  }
  set layer(val) {
    if (this._layer == val) return;
    svg_layerSortTrigger = true;
    this._layer.val = val;
    this.svgObj.setAttribute("layer", this._layer.val);
  }
  update() {
    updateLoop(this);
  }
}

export class pack_basic {
  dot = new pointer(new obj_Dot());
  pos = new pointer(this.dot.pos);
  velocity = new pointer(this.dot.velocity);
  svgBridge;
  holder;

  set svgObj(svgObj) {
    this.svgBridge.val.svgObj = svgObj;
  }
  get svgObj() {
    return this.svgBridge.svgObj;
  }

  svgLayer;
  get layer() {
    return this.svgLayer.layer;
  }
  set layer(val) {
    this.svgLayer.layer = val;
  }

  constructor(svgObj, x = 0, y = 0) {
    this.svgBridge = new pointer(new svg_bridge(svgObj));
    this.pos.x._val = x;
    this.pos.y._val = y;
    this.svgBridge.addAttribute(
      "cx",
      new refer(
        function () {
          return this.pos.x.val;
        }.bind(this)
      )
    );
    this.svgBridge.addAttribute(
      "cy",
      new refer(
        function () {
          return this.pos.y.val;
        }.bind(this)
      )
    );
    // this.svgBridge.addAttribute("cx", new pointer(this.pos.x));
    // this.svgBridge.addAttribute("cy", new pointer(this.pos.y));
    this.holder = new svg_hold(this.svgBridge, this.pos);
    this.svgLayer = new svg_layer(this.svgBridge, new pointer(1));
    this.update();
    return Delegation(this, ["svgBridge", "dot"]);
  }
  update() {
    this.svgBridge.update();
    updateLoop(this);
  }
}

export class pack_circle {
  static objectRegistry = new WeakMap();
  static nextId = 1;

  get getObjectId() {
    if (!pack_circle.objectRegistry.has(this)) {
      pack_circle.objectRegistry.set(this, pack_circle.nextId++);
    }
    return "circle" + pack_circle.objectRegistry.get(this);
  }
  
  packBasic = new pack_basic(svgCircle.cloneNode());
  // dot = this.packBasic.dot;
  pos = this.packBasic.pos;
  r = new pointer();
  text = new pointer(null);
  packText = new pointer(
    new pack_text(new pointer(this.text), this.pos.x, this.pos.y)
  );
  constructor(pos = { x: 0, y: 0 }, r = 20, text = "") {
    this.pos.x.val = pos.x;
    this.pos.y.val = pos.y;

    this.r.val = r;
    this.packBasic.svgBridge.addAttribute("r", new pointer(this.r));
    this.text._val = text;
    this.packText.packBasic.layer = this.packBasic.layer + 0.001;
    ani_lines.push(`let ${this.getObjectId} = new pack_circle( { x: ${pos.x}, y: ${pos.y} }, ${r} , ${text} );`)
    return Delegation(this, ["packBasic"]);
    // return new Proxy(this, DelegationHandler("packBasic"));
  }
}

export class pack_square {
  packBasic = new pack_basic(svgSquare.cloneNode());
  pos = this.packBasic.pos;
  width = new pointer(20);
  height = new pointer(20);
  rotate = new pointer(0);
  refer = new Proxy(this, refer);

  svgX = new pointer(
    new refer(
      function () {
        // console.log("called get");
        return this.pos.x - this.width / 2;
      }.bind(this)
    ),
    function (val) {
      // console.log("called set");
      this.pos.x.val = val + this.width / 2;
    }.bind(this)
  );
  svgY = new pointer(
    new refer(
      function () {
        // console.log("called get");
        return this.pos.y - this.height / 2;
      }.bind(this)
    ),
    function (val) {
      // console.log("called set");
      this.pos.y.val = val + this.height / 2;
    }.bind(this)
  );
  text = new pointer(null);
  packText = new pointer(
    new pack_text(new pointer(this.text), this.pos.x, this.pos.y)
  );

  get rotateTransform() {
    return new pointer(
      `rotate(${this.rotate.val} ${this.pos.x.val} ${this.pos.y.val})`
    );
  }
  constructor(x = 200, y = 200, width = 40, height = 40, text = "") {
    this.pos.x._val = x;
    this.pos.y._val = y;
    this.width._val = width;
    this.height._val = height;
    this.packBasic.svgBridge.addAttribute("x", this.svgX);
    this.packBasic.svgBridge.addAttribute("y", this.svgY);
    this.packBasic.svgBridge.addAttribute("width", new pointer(this.width));
    this.packBasic.svgBridge.addAttribute("height", new pointer(this.height));
    this.packBasic.svgBridge.addAttribute(
      "transform",
      new refer(
        function () {
          return this.rotateTransform;
        }.bind(this)
      )
    );
    this.text._val = text;
    this.packText.packBasic.layer = this.packBasic.layer + 0.001;
    // this.update();
    // console.log(this.packBasic.svgObj.val);
    // console.log(this.packText.packBasic.svgObj);
    // this.packBasic.svgObj.val.appendChild(this.packText.packBasic.svgObj.val);
    return Delegation(this, ["packBasic"]);
    // return new Proxy(this, DelegationHandler("packBasic"));
  }
  update() {
    // this.packBasic.svgObj.setAttribute("transform", this.rotateTransform.val);
    // this.rotate.val = (this.rotate + 1) % 360;
    updateLoop(this);
  }
}

export class pack_text {
  packBasic = new pack_basic(svgText.cloneNode());
  pos = this.packBasic.pos;
  x = new pointer(
    new refer(
      function () {
        return this.pos.x.val;
      }.bind(this),
      function (val) {
        this.pos.x.val = val;
      }.bind(this)
    )
  );
  y = new pointer(
    new refer(
      function () {
        return this.pos.y.val;
      }.bind(this),
      function (val) {
        this.pos.y.val = val;
      }.bind(this)
    )
  );
  text = new pointer("text");

  rotate = new pointer(0);
  constructor(text = "text", x = 120, y = 120) {
    this.pos.x._val = x;
    this.pos.y._val = y;
    this.text._val = text;
    // console.log(this.packBasic.svgBridge);
    // console.log(isProxy(this.packBasic.svgBridge));
    // console.log(this.packBasic);
    // console.log(isProxy(this.packBasic));
    this.packBasic.addAttribute("x", this.x);
    this.packBasic.addAttribute("y", this.y);
    // this doesn't work :(
    // this.packBasic.svgBridge.addAttribute("textContent", this.text);
    this.packBasic.addAttribute(
      "transform",
      new refer(
        function () {
          return this.rotateTransform;
        }.bind(this)
      )
    );
    this.packBasic.layer = 10;
    this.packBasic.holder.delete();
    this.update();
    return Delegation(this, ["packBasic"]);
  }
  get rotateTransform() {
    return new pointer(
      `rotate(${this.rotate.val} ${this.pos.x.val} ${this.pos.y.val})`
    );
  }
  update() {
    this.packBasic.svgObj.textContent = this.text.val;
    updateLoop(this);
  }
}

export class pack_line {
  get getObjectId() {
    if (!pack_circle.objectRegistry.has(this)) {
      pack_circle.objectRegistry.set(this, pack_circle.nextId++);
    }
    return "line" + pack_circle.objectRegistry.get(this);
  }
  obj1 = new pointer();
  obj2 = new pointer();
  pos1 = new pointer();
  pos2 = new pointer();
  // svgASA = new svg_ASA();
  svgObj = new pointer(new svg_bridge(svgLine.cloneNode()));
  bound;

  constructor(obj1, obj2) {
    this.obj1._val = obj1;
    this.obj2._val = obj2;
    this.pos1._val = this.obj1.pos;
    this.pos2._val = this.obj2.pos;
    this.svgObj.addAttribute("x1", new pointer(this.pos1.x));
    this.svgObj.addAttribute("y1", new pointer(this.pos1.y));
    this.svgObj.addAttribute("x2", new pointer(this.pos2.x));
    this.svgObj.addAttribute("y2", new pointer(this.pos2.y));
    this.svgLayer = new svg_layer(this.svgObj, new pointer(0));
    // console.log(this.obj1._val);
    // console.log(this.obj2._val);
    ani_lines.push(`let ${this.getObjectId} = new pack_line( ${obj1.getObjectId} , ${obj2.getObjectId} ); `)
    console.log("i see");
    this.bound = new obj_bound(this.obj1, this.obj2, 100, 150);
    this.update();
  }

  get posCenter() {
    return new Coordinate2d(
      (this.pos1.x + this.pos2.x) / 2,
      (this.pos1.y + this.pos2.y) / 2
    );
  }

  update() {
    this.svgObj.update();
    updateLoop(this);
  }
}

export class pack_array {
  dot = new obj_Dot();
  pos = new pointer(this.dot.pos);
  gap = new pointer(50);
  rad = new pointer(0);
  size = 0;
  constructor(pos, gap = pointer(50), rad = pointer(0)) {
    this.pos._val = pos;
    this.gap._val = gap;
    this.rad._val = rad;
    this.update();
    return Delegation(this, ["dot", "defaultArray"]);
  }
  containing = [];
  defaultArray = new Proxy([], {
    get: (target, prop, receiver) => {
      if (prop == "isProxy") return true;
      if (prop in target) return Reflect.get(target, prop, receiver);
      if (!isNaN(Number(prop))) return Reflect.get(target, prop, receiver);
      else return undefined;
    },
    set: (target, prop, value, receiver) => {
      if (!isNaN(Number(prop))) {
        return Reflect.set(target, prop, value, receiver);
      } else return false;
    },
  });
  maxIndex = -2;
  posGetter(index) {
    let xy = rotateMatrix(
      this.pos.x + (index + 1) * this.gap,
      this.pos.y,
      this.rad,
      this.pos.x,
      this.pos.y
    );
    // console.log(xy);
    return new Coordinate2d(xy.x, xy.y);
  }
  append(coord, index) {
    this.containing.push({ coord: coord, index: index });
    while (this.maxIndex < index) {
      this.maxIndex += 1;
      let newBox = new pack_square();
      newBox.svgObj = pack_array_svgBox.cloneNode();
      newBox.layer = 0.5;
      newBox.height._val = this.gap;
      newBox.width._val = this.gap;
      newBox.rotate._val = new refer(
        function () {
          return (this.rad.val / Math.PI) * 180;
        }.bind(this)
      );
      newBox.holder.delete();
      // newBox.packBasic.holder = new svg_hold(
      //   newBox.packBasic,
      //   newBox.packBasic.pos
      // );
      this.containing.push({
        coord: newBox.pos,
        index: this.maxIndex,
      });
    }
  }
  // append(val)
  // {
  //   this.containing.push({ coord: coord, index: index });
  // }

  update() {
    for (var i = 0; i < this.containing.length; i++) {
      let coord = this.containing[i].coord;
      let index = this.containing[i].index;
      let newCoord = this.posGetter(index);
      coord.x.val = newCoord.x.val;
      coord.y.val = newCoord.y.val;
    }
    for (var i = 0; i < this.defaultArray.length; i++) {
      if (typeof this.defaultArray[i] == "number")
        this.defaultArray[i] = new pack_text(this.defaultArray[i]);
      if (typeof this.defaultArray[i] != "object") continue;
      let coord = this.defaultArray[i].pos;
      let index = i;
      let newCoord = this.posGetter(index);
      coord.x.val = newCoord.x.val;
      coord.y.val = newCoord.y.val;
    }

    updateLoop(this);
  }
}

{
  var svgLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  svgLine.setAttribute("stroke", "gray");
  svgLine.setAttribute("stroke-width", "4");
}
{
  var svgCircleMarker = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  // 設定 circle 的屬性
  svgCircleMarker.setAttribute("cx", 100); // 設定圓心的 X 座標為點擊位置
  svgCircleMarker.setAttribute("cy", 100); // 設定圓心的 Y 座標為點擊位置
  svgCircleMarker.setAttribute("r", "30"); // 設定圓形半徑
  svgCircleMarker.setAttribute("fill", "none"); // 設定圓形顏色
  svgCircleMarker.setAttribute("stroke", "red");
  svgCircleMarker.setAttribute("stroke-width", "4");
  svgCircleMarker.setAttribute("layer", "1");
}

{
  var svgCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  // 設定 circle 的屬性
  svgCircle.setAttribute("cx", 1000); // 設定圓心的 X 座標為點擊位置
  svgCircle.setAttribute("cy", 1000); // 設定圓心的 Y 座標為點擊位置
  svgCircle.setAttribute("r", "20"); // 設定圓形半徑
  svgCircle.setAttribute("fill", "white"); // 設定圓形顏色
  svgCircle.setAttribute("stroke", "black");
  svgCircle.setAttribute("stroke-width", "4");
  svgCircle.setAttribute("layer", "1");
}

{
  var svgText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  svgText.textContent = "txc";

  svgText.setAttribute("cx", 120);
  svgText.setAttribute("cy", 120);
  svgText.setAttribute("x", 120);
  svgText.setAttribute("y", 120);
  svgText.setAttribute("dominant-baseline", "middle");
  svgText.setAttribute("text-anchor", "middle");
  svgText.setAttribute("innerHTML", "txc");
}
{
  var svgSquare = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  // 設定 circle 的屬性
  svgSquare.setAttribute("x", 100); // 設定圓心的 X 座標為點擊位置
  svgSquare.setAttribute("y", 100); // 設定圓心的 Y 座標為點擊位置
  svgSquare.setAttribute("width", "40"); // 設定圓形半徑
  svgSquare.setAttribute("height", "40"); // 設定圓形半徑
  svgSquare.setAttribute("fill", "white"); // 設定圓形顏色
  svgSquare.setAttribute("stroke", "black");
  svgSquare.setAttribute("stroke-width", "4");
  svgSquare.setAttribute("layer", "1");
}
{
  var pack_array_svgBox = svgSquare.cloneNode();
  pack_array_svgBox.setAttribute("stroke-width", "2");
  pack_array_svgBox.setAttribute("stroke", "gray");
}
{
  var c1 = new pack_circle(
    { x: 300 * Math.random(), y: 300 * Math.random() },
    20,
    "a"
  );
  var c2 = new pack_circle({ x: 300 * Math.random(), y: 300 * Math.random() });
  var c3 = new pack_circle({ x: 300 * Math.random(), y: 300 * Math.random() });
  var c4 = new pack_circle({ x: 300 * Math.random(), y: 300 * Math.random() });
  var c5 = new pack_circle({ x: 300 * Math.random(), y: 300 * Math.random() });
  var c6 = new pack_circle({ x: 300 * Math.random(), y: 300 * Math.random() });
  var c7 = new pack_circle({ x: 300 * Math.random(), y: 300 * Math.random() });
}
let myArray = new pack_array(c1.pos, new pointer(50), new pointer(0));
myArray.append(c2.pos, 0);
myArray.append(c3.pos, 1);
myArray.append(c4.pos, 3);
let myArray2 = new pack_array(
  c4.pos,
  new pointer(50),
  new refer(
    function () {
      return this.rad + Math.PI / 2;
    }.bind(myArray)
  )
);
myArray2.append(c6.pos, 0);
myArray2.append(c7.pos, 1);
myArray[4] = 444;
myArray[5] = 555;
myArray[6] = new pack_circle();
// console.log(myArray);
let tmp = new pointer(c1);
let l1 = new pack_line(c1, c5);

let s1 = new pack_square();
s1.text._val = "this is a square";
// console.log(s1.svgObj.val.constructor.name);
// console.log(s1.packText.svgObj.val);
// console.log(s1.svgObj.appendChild);
// s1.svgObj.appendChild(s1.packText.svgObj.val);


// let t1 = new pack_text();
// t1.holder = new svg_hold(t1.svgBridge, t1.pos);
// Reflect.defineProperty(t1, "hold", {
//   value: new svg_hold(t1.svgBridge, t1.pos),
//   writable: true,
//   enumerable: true,
//   configurable: true,
// });
// t1.holder = new svg_hold(t1.svgBridge, t1.pos);

let c8 = new pack_square();
c8.pos.x._val = new refer(
  function () {
    return mouse.x;
  }.bind(this)
);
c8.pos.y._val = new refer(
  function () {
    return mouse.y;
  }.bind(this)
);
c8.layer = 0;

let m = new pack_circle();
m.pos.x._val = new pointer(c2.pos.x);
m.pos.y._val = new pointer(c2.pos.y);
m.pos._val = c2.pos;
m.r.val = 25;
m.packBasic.layer = 3;
m.packBasic.svgBridge.setAttribute("fill", "none");
m.packBasic.svgBridge.setAttribute("stroke", "red");
m.packBasic.svgBridge.setAttribute("stroke-width", "4");

let animateData = {
  ori: new pointer(),
  startT: 0,
  duration: 0,
  end: new pointer(),
};
let aD = animateData;

export function animate(end, duration = 1000) {
  // console.log("called animation");
  aD.startT = time.curFrame;
  aD.duration = duration;
  aD.ori._val = m.packBasic.pos.val;
  aD.end._val = end;
  m.packBasic.pos._val = new refer(
    function () {
      // console.log("called animation pos");
      let dt = time.curFrame - aD.startT;
      let k = dt / aD.duration;
      if (k > 1) k = k;
      let x = aD.ori.x.val * (1 - k) + aD.end.x.val * k;
      let y = aD.ori.y.val * (1 - k) + aD.end.y.val * k;
      return new Coordinate2d(new pointer(x), new pointer(y));
    },
    function () {
      console.error("oof");
    }
  );
  setTimeout(() => {
    m.packBasic.pos._val = end;
  }, duration);
}
// function _animate;() {}

export function updateTime() {
  time.prevFrame = time.curFrame;
  time.curFrame = Date.now();
  time.deltaFrame = time.curFrame - time.prevFrame;
  time.delta = time.deltaFrame / 1000;
}

export function sortByLayerCmp(a, b) {
  if (a.getAttribute("layer") < b.getAttribute("layer")) return -1;
  if (a.getAttribute("layer") >= b.getAttribute("layer")) return 1;
  return 0;
}
export function sortByLayer() {
  var indexes = svg.querySelectorAll("[layer]");
  var indexesArray = Array.from(indexes);
  let sorted = indexesArray.sort(sortByLayerCmp);
  sorted.forEach((e) => svg.appendChild(e));
}

var theEvent = null;

window.addEventListener("mousemove", function (event) {
  theEvent = event;
});
window.addEventListener("mousedown", function (event) {
  mouse.hold = true;
});
window.addEventListener("mouseup", function (event) {
  mouse.hold = false;
});

window.addEventListener("keydown", function (event) {
  // 檢查是否按下空白鍵（空白鍵的 key 是 " " 或 keyCode 是 32）
  if (event.code === "Space" || event.key === " ") {
    console.log("空白鍵被按下！");
    s1.width.val += 1;
    myArray.rad._val += Math.PI / 45;
    // let i = myPoints.length - 1;
    // let bound = new pack_line(myPoints[i - 1], myPoints[i]);
    // myGravity.append(myPoints[i]);

    // 防止預設行為，例如捲動頁面
    event.preventDefault();
  }
});

// objUpdateList = [];

// setTimeout(sortByLayer, 100);
sortByLayer();
export function update() {
  updateTime();

  // myArray[5] = 5555;

  if (svg_layerSortTrigger) {
    sortByLayer();
    svg_layerSortTrigger = false;
  }
  if (theEvent != null) {
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    mouse.x = theEvent.clientX; // 滑鼠相對於視窗左邊的 X 座標
    mouse.y = theEvent.clientY; // 滑鼠相對於視窗頂部的 Y 座標
    mouse.dX = mouse.x - mouse.lastX;
    mouse.dY = mouse.y - mouse.lastY;
  }
  // c1.x = mouse.x;
  // c1.y = mouse.y;
  // c1.update();

  setTimeout(update, frameT);
}

update();

// setTimeout(() => {
//   animate(c1.pos);
// }, 1000);

let animationList = [c1.pos, c2.pos, c3.pos, c4.pos, c5.pos, c6.pos, c7.pos];
let i = 0;
export function playanimation() {
  if (i >= animationList.length) i = 0;
  animate(animationList[i]);
  i += 1;
  setTimeout(playanimation, 1500);
}

setTimeout(() => {
  playanimation();
}, 1000);

export class pack_segTree {
  pos = new pointer(new Coordinate2d());
  sepDist = new pointer(10);
  size = new pointer();
  len = new pointer();
  height = new pointer();
  contain = [];
  holder = new pointer();
  constructor(size, len, height) {
    this.size._val = size;
    this.len._val = len;
    this.height._val = height;
    this.pos.x._val = 400;
    this.pos.y._val = 100;
    this.build();
    this.holder._val = new svg_hold(
      this.contain[0].packBasic.svgBridge,
      this.pos
    );
  }
  build(
    L = 0,
    R = this.size.val - 1,
    id = 0,
    len = this.len,
    center = this.pos.x,
    depth = 0
  ) {
    this.contain[id] = new pack_square(
      new refer(
        function (center) {
          return center.val;
        }.bind(this, center),
        function (val) {}
      ),
      new refer(
        function (depth) {
          return this.pos.y.val + depth * (this.sepDist + this.height);
        }.bind(this, depth),
        function (val) {}
      ),
      len,
      this.height,
      `[${L}, ${R}]`
    );

    this.contain[id].packBasic.holder.delete();

    if (L != R) {
      var M = Math.floor((L + R) / 2);
      this.build(
        L,
        M,
        id * 2 + 1,
        new refer(
          function (len) {
            return (len - this.sepDist) / 2;
          }.bind(this, len)
        ),
        new refer(
          function (len, center) {
            return center - len / 4 - this.sepDist / 4;
          }.bind(this, len, center)
        ),
        depth + 1
      );
      this.build(
        M + 1,
        R,
        id * 2 + 2,
        new refer(
          function (len) {
            return (len - this.sepDist) / 2;
          }.bind(this, len)
        ),
        new refer(
          function (len, center) {
            return center + len / 4 + this.sepDist / 4;
          }.bind(this, len, center)
        ),
        depth + 1
      );
    }
  }
}

let mySegTree = new pack_segTree(13, 600, 40);

window.addEventListener("keydown", function (event) {
  // 檢查是否按下空白鍵（空白鍵的 key 是 " " 或 keyCode 是 32）
  if (event.code === "Space" || event.key === " ") {
    mySegTree.len._val += 3;

    // let i = myPoints.length - 1;
    // let bound = new pack_line(myPoints[i - 1], myPoints[i]);
    // myGravity.append(myPoints[i]);

    // 防止預設行為，例如捲動頁面
    event.preventDefault();
  }
});