import { type IC, createInnerClass } from "./util";
import { Predicate } from "./Predicate";
import { Variable } from "./Variable";
import { List } from "./List";
import { VM } from "./VM";
import { For } from "./For";
import { Member } from "./Member";

export class Ct implements Predicate {
  private _cdwTentList: List<number>;
  private _ENV_OADBList: List<number>;
  private _GspecList: List<number>;
  private _PinList: List<number>;
  private _PspecList: List<number>;
  private _OARHexitList: List<number>;
  private _OARHentList: List<number>;
  private _cdwWList: List<number>;
  private _RadspecList: List<number>;
  private _apT: Variable<number>;
  private _LF: Variable<number>;
  private cont: Predicate;

  public constructor(
    _cdwTentList: List<number>,
    _ENV_OADBList: List<number>,
    _GspecList: List<number>,
    _PinList: List<number>,
    _PspecList: List<number>,
    _OARHexitList: List<number>,
    _OARHentList: List<number>,
    _cdwWList: List<number>,
    _RadspecList: List<number>,
    _apT: Variable<number>,
    _LF: Variable<number>,
    cont: Predicate
  ) {
    this._cdwTentList = _cdwTentList;
    this._ENV_OADBList = _ENV_OADBList;
    this._GspecList = _GspecList;
    this._PinList = _PinList;
    this._PspecList = _PspecList;
    this._OARHexitList = _OARHexitList;
    this._OARHentList = _OARHentList;
    this._cdwWList = _cdwWList;
    this._RadspecList = _RadspecList;
    this._apT = _apT;
    this._LF = _LF;
    this.cont = cont;
  }

  public exec(vm: VM): Predicate {
    return new this.Method_1().exec(vm);
  }

  public Method_1: IC = createInnerClass(this).with(
    (outerThis) =>
      class implements Predicate {
        private _cdwTent: Variable<number> = new Variable<number>();
        private _ENV_OADB: Variable<number> = new Variable<number>();
        private _Gspec: Variable<number> = new Variable<number>();
        private _Pin: Variable<number> = new Variable<number>();
        private _Pspec: Variable<number> = new Variable<number>();
        private _OARHexit: Variable<number> = new Variable<number>();
        private _OARHent: Variable<number> = new Variable<number>();
        private _cdwW: Variable<number> = new Variable<number>();
        private _Radspec: Variable<number> = new Variable<number>();
        private _飽和水蒸気圧h2: Variable<number> = new Variable<number>();
        private _飽和水蒸気圧h1: Variable<number> = new Variable<number>();
        private _idealG: Variable<number> = new Variable<number>();
        private _水蒸気分圧h2: Variable<number> = new Variable<number>();
        private _水蒸気分圧: Variable<number> = new Variable<number>();
        private _OAAHexit: Variable<number> = new Variable<number>();
        private _OAAHent: Variable<number> = new Variable<number>();
        private _ENexit: Variable<number> = new Variable<number>();
        private _ENin: Variable<number> = new Variable<number>();
        private _heatH: Variable<number> = new Variable<number>();
        private _idealRad: Variable<number> = new Variable<number>();
        private _ENV_OAWB: Variable<number> = new Variable<number>();
        private _Rade: Variable<number> = new Variable<number>();
        private _cdwTexit: Variable<number> = new Variable<number>();
        private _constraint_cdwTexit: Variable<boolean> =
          new Variable<boolean>();

        public exec(vm: VM): Predicate {
          return this.method_1_cu1.exec(vm);
        }

        public Method_1_cu1: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._cdwTent,
                  outerThis._cdwTentList,
                  methodThis.method_1_cu2
                );
              }
            }
        );

        public Method_1_cu2: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._OARHexit,
                  outerThis._OARHexitList,
                  methodThis.method_1_cu3
                );
              }
            }
        );

        public Method_1_cu3: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                methodThis._飽和水蒸気圧h2.setValue(
                  Math.exp(
                    6.18145 * 10 ** -12 * methodThis._cdwTent.getValue() ** 5 -
                      3.42981 * 10 ** -9 * methodThis._cdwTent.getValue() ** 4 +
                      1.11342 * 10 ** -6 * methodThis._cdwTent.getValue() ** 3 -
                      2.98633 * 10 ** -4 * methodThis._cdwTent.getValue() ** 2 +
                      7.26543 * 10 ** -2 * methodThis._cdwTent.getValue() -
                      5.11134
                  ) *
                    760 *
                    133.32
                );
                methodThis._水蒸気分圧h2.setValue(
                  (methodThis._OARHexit.getValue() *
                    methodThis._飽和水蒸気圧h2.getValue()) /
                    100
                );
                methodThis._OAAHexit.setValue(
                  (0.622 * methodThis._水蒸気分圧h2.getValue()) /
                    (101325 - methodThis._水蒸気分圧h2.getValue())
                );
                methodThis._ENexit.setValue(
                  1.006 * methodThis._cdwTent.getValue() +
                    (1.805 * methodThis._cdwTent.getValue() + 2501) *
                      methodThis._OAAHexit.getValue()
                );
                return methodThis.method_1_cu4;
              }
            }
        );

        public Method_1_cu4: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._ENV_OADB,
                  outerThis._ENV_OADBList,
                  methodThis.method_1_cu5
                );
              }
            }
        );

        public Method_1_cu5: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                methodThis._ENin.setValue(
                  1.006 * methodThis._ENV_OADB.getValue() +
                    (1.805 * methodThis._ENV_OADB.getValue() + 2501) *
                      methodThis._OAAHexit.getValue()
                );
                return methodThis.method_1_cu6;
              }
            }
        );

        public Method_1_cu6: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._Gspec,
                  outerThis._GspecList,
                  methodThis.method_1_cu7
                );
              }
            }
        );

        public Method_1_cu7: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._Pin,
                  outerThis._PinList,
                  methodThis.method_1_cu8
                );
              }
            }
        );

        public Method_1_cu8: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._Pspec,
                  outerThis._PspecList,
                  methodThis.method_1_cu9
                );
              }
            }
        );

        public Method_1_cu9: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                methodThis._idealG.setValue(
                  methodThis._Gspec.getValue() *
                    (methodThis._Pin.getValue() /
                      methodThis._Pspec.getValue()) **
                      (1 / 3)
                );
                methodThis._idealRad.setValue(
                  (methodThis._ENexit.getValue() -
                    methodThis._ENin.getValue()) *
                    methodThis._idealG.getValue() *
                    1.161 *
                    1000
                );
                return methodThis.method_1_cu10;
              }
            }
        );

        public Method_1_cu10: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._cdwW,
                  outerThis._cdwWList,
                  methodThis.method_1_cu11
                );
              }
            }
        );

        public Method_1_cu11: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                methodThis._heatH.setValue(
                  6.08 * 10 ** -6 * methodThis._Pin.getValue() +
                    -0.0134371 * methodThis._cdwTent.getValue() +
                    27.1227 * methodThis._cdwW.getValue() +
                    -0.171 * methodThis._OAAHexit.getValue() +
                    -4.01 *
                      10 ** -10 *
                      methodThis._Pin.getValue() *
                      methodThis._Pin.getValue() +
                    5.17 *
                      10 ** -7 *
                      methodThis._Pin.getValue() *
                      methodThis._cdwTent.getValue() +
                    -9.41 *
                      10 ** -5 *
                      methodThis._Pin.getValue() *
                      methodThis._cdwW.getValue() +
                    -0.000989227 *
                      methodThis._Pin.getValue() *
                      methodThis._OAAHexit.getValue() +
                    0.000252793 *
                      methodThis._cdwTent.getValue() *
                      methodThis._cdwTent.getValue() +
                    -0.6535 *
                      methodThis._cdwTent.getValue() *
                      methodThis._cdwW.getValue() +
                    1.34834 *
                      methodThis._cdwTent.getValue() *
                      methodThis._OAAHexit.getValue() +
                    -46.4248 *
                      methodThis._cdwW.getValue() *
                      methodThis._cdwW.getValue() +
                    610.065 *
                      methodThis._cdwW.getValue() *
                      methodThis._OAAHexit.getValue() +
                    -2364.73 *
                      methodThis._OAAHexit.getValue() *
                      methodThis._OAAHexit.getValue() +
                    0.217912
                );
                methodThis._Rade.setValue(
                  methodThis._idealRad.getValue() * methodThis._heatH.getValue()
                );
                methodThis._cdwTexit.setValue(
                  methodThis._cdwTent.getValue() -
                    methodThis._Rade.getValue() /
                      (4.186 * methodThis._cdwW.getValue() * 10 ** 6)
                );
                methodThis._constraint_cdwTexit.setValue(
                  0 < methodThis._cdwTexit.getValue() &&
                    methodThis._cdwTexit.getValue() < 100
                );
                return methodThis.method_1_cu12;
              }
            }
        );

        public Method_1_cu12: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                methodThis._飽和水蒸気圧h1.setValue(
                  Math.exp(
                    6.18145 * 10 ** -12 * methodThis._ENV_OADB.getValue() ** 5 -
                      3.42981 *
                        10 ** -9 *
                        methodThis._ENV_OADB.getValue() ** 4 +
                      1.11342 *
                        10 ** -6 *
                        methodThis._ENV_OADB.getValue() ** 3 -
                      2.98633 *
                        10 ** -4 *
                        methodThis._ENV_OADB.getValue() ** 2 +
                      7.26543 * 10 ** -2 * methodThis._ENV_OADB.getValue() -
                      5.11134
                  ) *
                    760 *
                    133.32
                );
                return methodThis.method_1_cu13;
              }
            }
        );

        public Method_1_cu13: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._OARHent,
                  outerThis._OARHentList,
                  methodThis.method_1_cu14
                );
              }
            }
        );

        public Method_1_cu14: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                methodThis._水蒸気分圧.setValue(
                  (methodThis._OARHent.getValue() *
                    methodThis._飽和水蒸気圧h1.getValue()) /
                    100
                );
                methodThis._OAAHent.setValue(
                  (0.622 * methodThis._水蒸気分圧.getValue()) /
                    (101325 - methodThis._水蒸気分圧.getValue())
                );
                methodThis._ENV_OAWB.setValue(
                  (2.15048e-10 * methodThis._ENin.getValue() ** 5 -
                    1.31767e-7 * methodThis._ENin.getValue() ** 4 +
                    3.52421e-5 * methodThis._ENin.getValue() ** 3 -
                    0.00565988 * methodThis._ENin.getValue() ** 2 +
                    0.691948 * methodThis._ENin.getValue() -
                    6.0524) /
                    (1 +
                      methodThis._OAAHexit.getValue() *
                        (3.60379e-9 * methodThis._ENin.getValue() ** 4 -
                          1.95259e-6 * methodThis._ENin.getValue() ** 3 +
                          0.000418588 * methodThis._ENin.getValue() ** 2 -
                          0.0465277 * methodThis._ENin.getValue() +
                          2.88767))
                );
                outerThis._apT.setValue(
                  methodThis._cdwTexit.getValue() -
                    methodThis._ENV_OAWB.getValue()
                );
                return methodThis.method_1_cu15;
              }
            }
        );

        public Method_1_cu15: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._Radspec,
                  outerThis._RadspecList,
                  methodThis.method_1_cu16
                );
              }
            }
        );

        public Method_1_cu16: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                outerThis._LF.setValue(
                  methodThis._Rade.getValue() / methodThis._Radspec.getValue()
                );
                return outerThis.cont;
              }
            }
        );

        private method_1_cu1 = new this.Method_1_cu1();
        private method_1_cu2 = new this.Method_1_cu2();
        private method_1_cu3 = new this.Method_1_cu3();
        private method_1_cu4 = new this.Method_1_cu4();
        private method_1_cu5 = new this.Method_1_cu5();
        private method_1_cu6 = new this.Method_1_cu6();
        private method_1_cu7 = new this.Method_1_cu7();
        private method_1_cu8 = new this.Method_1_cu8();
        private method_1_cu9 = new this.Method_1_cu9();
        private method_1_cu10 = new this.Method_1_cu10();
        private method_1_cu11 = new this.Method_1_cu11();
        private method_1_cu12 = new this.Method_1_cu12();
        private method_1_cu13 = new this.Method_1_cu13();
        private method_1_cu14 = new this.Method_1_cu14();
        private method_1_cu15 = new this.Method_1_cu15();
        private method_1_cu16 = new this.Method_1_cu16();
      }
  );
}

export const main = (input: {
  __cdwTentList: number[];
  __ENV_OADBList: number[];
  __GspecList: number[];
  __PinList: number[];
  __PspecList: number[];
  __OARHexitList: number[];
  __OARHentList: number[];
  __cdwWList: number[];
  __RadspecList: number[];
}) => {
  const vm: VM = new VM();
  const __cdwTentList: List<number> = new List<number>(input.__cdwTentList);
  const __ENV_OADBList: List<number> = new List<number>(input.__ENV_OADBList);
  const __GspecList: List<number> = new List<number>(input.__GspecList);
  const __PinList: List<number> = new List<number>(input.__PinList);
  const __PspecList: List<number> = new List<number>(input.__PspecList);
  const __OARHexitList: List<number> = new List<number>(input.__OARHexitList);
  const __OARHentList: List<number> = new List<number>(input.__OARHentList);
  const __cdwWList: List<number> = new List<number>(input.__cdwWList);
  const __RadspecList: List<number> = new List<number>(input.__RadspecList);
  const __apT: Variable<number> = new Variable<number>(0);
  const __LF: Variable<number> = new Variable<number>(0);
  const p: Predicate = new Ct(
    __cdwTentList,
    __ENV_OADBList,
    __GspecList,
    __PinList,
    __PspecList,
    __OARHexitList,
    __OARHentList,
    __cdwWList,
    __RadspecList,
    __apT,
    __LF,
    Predicate.success
  );

  const result: {
    _apT: number;
    _LF: number;
  }[] = [];

  for (let s: boolean = vm.call(p); s === true; s = vm.redo()) {
    result.push({
      _apT: __apT.getValue(),
      _LF: __LF.getValue(),
    });
  }

  return result;
};
