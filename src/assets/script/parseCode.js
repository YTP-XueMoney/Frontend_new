export default (input) => {
  const lines = input.split('\n'); // 將文字分行
  const graph = {};
  // 遍歷每一行，解析 draw 和 anime 部分
  lines.forEach((line) => {
    // console.log(line);
    // 解析 draw 部分
    const connections = line.trim().split('-'); // 分離節點
    for (let i = 0; i < connections.length; i++) {
      if (connections[i] != '' && !graph[connections[i]]) {
        graph[connections[i]] = []; // 初始化節點
      }
    }
    for (let i = 0; i < connections.length - 1; i++) {
      const source = connections[i];
      const target = connections[i + 1];
      if (source == '' || target == '') continue;
      graph[source].push(target); // 增加連線
      console.log(source + '->' + target);
    }
  });
  return graph;
}

class Runcode{
  output = '';
  input = '';
  constructor(code, input) {
    this.code = code;
    this.input = input;
    this.output = '';
  }
  modifyCode(s){
    this.code = s;
  }

  modifyinput(s){
    this.input = s;
  }

  run(){
    eval(this.code);
    console.log(this.input);
    this.output = this.input + 'qq';
    console.log('output: ' + this.output);
  }
}

export const coderun = new Runcode('', '');