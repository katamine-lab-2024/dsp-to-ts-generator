import { type IC, createInnerClass } from "./util";
import { Predicate } from "./Predicate";
import { Variable } from "./Variable";
import { List } from "./List";
import { VM } from "./VM";
import { For } from "./For";
import { Member } from "./Member";
import { Test } from "./Test";

export class TRn implements Predicate {
  private _aUXPinList: List<number>;
  private _ModelList: List<number>;
  private _pinList: List<number>;
  private _cwTentList: List<number>;
  private _cdwTentList: List<number>;
  private _cdwWList: List<number>;
  private _cwWList: List<number>;
  private _cwTexit: Variable<number>;
  private _cOP: Variable<number>;
  private _cdwTexit: Variable<number>;
  private _constraint_cwTexit: Variable<boolean>;
  private _constraint_cOP: Variable<boolean>;
  private _constraint_cdwTexit: Variable<boolean>;
  private cont: Predicate;

  public constructor(
    _aUXPinList: List<number>,
    _ModelList: List<number>,
    _pinList: List<number>,
    _cwTentList: List<number>,
    _cdwTentList: List<number>,
    _cdwWList: List<number>,
    _cwWList: List<number>,
    _cwTexit: Variable<number>,
    _cOP: Variable<number>,
    _cdwTexit: Variable<number>,
    _constraint_cwTexit: Variable<boolean>,
    _constraint_cOP: Variable<boolean>,
    _constraint_cdwTexit: Variable<boolean>,
    cont: Predicate
  ) {
    this._aUXPinList = _aUXPinList;
    this._ModelList = _ModelList;
    this._pinList = _pinList;
    this._cwTentList = _cwTentList;
    this._cdwTentList = _cdwTentList;
    this._cdwWList = _cdwWList;
    this._cwWList = _cwWList;
    this._cwTexit = _cwTexit;
    this._cOP = _cOP;
    this._cdwTexit = _cdwTexit;
    this._constraint_cwTexit = _constraint_cwTexit;
    this._constraint_cOP = _constraint_cOP;
    this._constraint_cdwTexit = _constraint_cdwTexit;
    this.cont = cont;
  }

  public exec(vm: VM): Predicate {
    return new this.Method_1().exec(vm);
  }

  public Method_1: IC = createInnerClass(this).with(
    (outerThis) =>
      class implements Predicate {
        private _pin: Variable<number> = new Variable<number>();
        private _aUXPin: Variable<number> = new Variable<number>();
        private _Model: Variable<number> = new Variable<number>();
        private _cwTent: Variable<number> = new Variable<number>();
        private _cdwTent: Variable<number> = new Variable<number>();
        private _cdwW: Variable<number> = new Variable<number>();
        private _cwW: Variable<number> = new Variable<number>();
        private _q: Variable<number> = new Variable<number>();
        private _p: Variable<number> = new Variable<number>();
        private _rad: Variable<number> = new Variable<number>();

        public exec(vm: VM): Predicate {
          return this.method_1_cu1.exec(vm);
        }

        public Method_1_cu1: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._cwTent,
                  outerThis._cwTentList,
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
                  methodThis._pin,
                  outerThis._pinList,
                  methodThis.method_1_cu3
                );
              }
            }
        );

        public Method_1_cu3: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._cdwTent,
                  outerThis._cdwTentList,
                  methodThis.method_1_cu4
                );
              }
            }
        );

        public Method_1_cu4: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._cwW,
                  outerThis._cwWList,
                  methodThis.method_1_cu5
                );
              }
            }
        );

        public Method_1_cu5: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._cdwW,
                  outerThis._cdwWList,
                  methodThis.method_1_cu6
                );
              }
            }
        );

        public Method_1_cu6: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                methodThis._q.setValue(
                  13.86 * methodThis._pin.getNumberValue() +
                    90895.9 * methodThis._cwTent.getNumberValue() +
                    -66323.2 * methodThis._cdwTent.getNumberValue() +
                    0 * methodThis._cwW.getNumberValue() +
                    0 * methodThis._cdwW.getNumberValue() +
                    -0.0000366418 *
                      methodThis._pin.getNumberValue() *
                      methodThis._pin.getNumberValue() +
                    -0.384187 *
                      methodThis._pin.getNumberValue() *
                      methodThis._cwTent.getNumberValue() +
                    0.220356 *
                      methodThis._pin.getNumberValue() *
                      methodThis._cdwTent.getNumberValue() +
                    78.8856 *
                      methodThis._pin.getNumberValue() *
                      methodThis._cwW.getNumberValue() +
                    6.98206 *
                      methodThis._pin.getNumberValue() *
                      methodThis._cdwW.getNumberValue() +
                    -2751.02 *
                      methodThis._cwTent.getNumberValue() *
                      methodThis._cwTent.getNumberValue() +
                    2906.12 *
                      methodThis._cwTent.getNumberValue() *
                      methodThis._cdwTent.getNumberValue() +
                    0 *
                      methodThis._cwTent.getNumberValue() *
                      methodThis._cwW.getNumberValue() +
                    0 *
                      methodThis._cwTent.getNumberValue() *
                      methodThis._cdwW.getNumberValue() +
                    -1051.24 *
                      methodThis._cdwTent.getNumberValue() *
                      methodThis._cdwTent.getNumberValue() +
                    0 *
                      methodThis._cdwTent.getNumberValue() *
                      methodThis._cwW.getNumberValue() +
                    0 *
                      methodThis._cdwTent.getNumberValue() *
                      methodThis._cdwW.getNumberValue() +
                    0 *
                      methodThis._cwW.getNumberValue() *
                      methodThis._cwW.getNumberValue() +
                    0 *
                      methodThis._cwW.getNumberValue() *
                      methodThis._cdwW.getNumberValue() +
                    0 *
                      methodThis._cdwW.getNumberValue() *
                      methodThis._cdwW.getNumberValue() +
                    0
                );
                outerThis._cwTexit.setValue(
                  methodThis._cwTent.getNumberValue() -
                    (methodThis._q.getNumberValue() / 4.186) *
                      methodThis._cwW.getNumberValue() *
                      10 ** 6
                );
                if (
                  !(
                    0 < outerThis._cwTexit.getNumberValue() &&
                    outerThis._cwTexit.getNumberValue() < 100
                  )
                ) {
                  outerThis._constraint_cwTexit.setValue(false);
                }
                outerThis._constraint_cwTexit.setValue(true);
                return methodThis.method_1_cu7;
              }
            }
        );

        public Method_1_cu7: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._aUXPin,
                  outerThis._aUXPinList,
                  methodThis.method_1_cu8
                );
              }
            }
        );

        public Method_1_cu8: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                methodThis._p.setValue(
                  methodThis._pin.getNumberValue() +
                    methodThis._aUXPin.getNumberValue()
                );
                outerThis._cOP.setValue(
                  methodThis._q.getNumberValue() /
                    methodThis._p.getNumberValue()
                );
                if (!(5 < outerThis._cOP.getNumberValue())) {
                  outerThis._constraint_cOP.setValue(false);
                }
                outerThis._constraint_cOP.setValue(true);
                return methodThis.method_1_cu9;
              }
            }
        );

        public Method_1_cu9: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                methodThis._rad.setValue(
                  methodThis._q.getNumberValue() +
                    methodThis._p.getNumberValue()
                );
                outerThis._cdwTexit.setValue(
                  methodThis._cdwTent.getNumberValue() +
                    (methodThis._rad.getNumberValue() / 4.186) *
                      methodThis._cdwW.getNumberValue() *
                      10 ** 6
                );
                if (
                  !(
                    0 < outerThis._cdwTexit.getNumberValue() &&
                    outerThis._cdwTexit.getNumberValue() < 100
                  )
                ) {
                  outerThis._constraint_cdwTexit.setValue(false);
                }
                outerThis._constraint_cdwTexit.setValue(true);
                return methodThis.method_1_cu10;
              }
            }
        );

        public Method_1_cu10: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(
                  methodThis._Model,
                  outerThis._ModelList,
                  outerThis.cont
                );
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
      }
  );
}

export const main = (input: {
  __aUXPinList: number[];
  __ModelList: number[];
  __pinList: number[];
  __cwTentList: number[];
  __cdwTentList: number[];
  __cdwWList: number[];
  __cwWList: number[];
}) => {
  const vm: VM = new VM();
  const __aUXPinList: List<number> = new List<number>(input.__aUXPinList);
  const __ModelList: List<number> = new List<number>(input.__ModelList);
  const __pinList: List<number> = new List<number>(input.__pinList);
  const __cwTentList: List<number> = new List<number>(input.__cwTentList);
  const __cdwTentList: List<number> = new List<number>(input.__cdwTentList);
  const __cdwWList: List<number> = new List<number>(input.__cdwWList);
  const __cwWList: List<number> = new List<number>(input.__cwWList);
  const __cwTexit: Variable<number> = new Variable<number>(0);
  const __cOP: Variable<number> = new Variable<number>(0);
  const __cdwTexit: Variable<number> = new Variable<number>(0);
  const __constraint_cwTexit: Variable<boolean> = new Variable<boolean>();
  const __constraint_cOP: Variable<boolean> = new Variable<boolean>();
  const __constraint_cdwTexit: Variable<boolean> = new Variable<boolean>();
  const p: Predicate = new TRn(
    __aUXPinList,
    __ModelList,
    __pinList,
    __cwTentList,
    __cdwTentList,
    __cdwWList,
    __cwWList,
    __cwTexit,
    __cOP,
    __cdwTexit,
    __constraint_cwTexit,
    __constraint_cOP,
    __constraint_cdwTexit,
    Predicate.success
  );

  const result: {
    _cwTexit: number;
    _cOP: number;
    _cdwTexit: number;
    _constraint_cwTexit: boolean;
    _constraint_cOP: boolean;
    _constraint_cdwTexit: boolean;
  }[] = [];

  for (let s: boolean = vm.call(p); s === true; s = vm.redo()) {
    result.push({
      _cwTexit: __cwTexit.getNumberValue(),
      _cOP: __cOP.getNumberValue(),
      _cdwTexit: __cdwTexit.getNumberValue(),
      _constraint_cwTexit: __constraint_cwTexit.getValue(),
      _constraint_cOP: __constraint_cOP.getValue(),
      _constraint_cdwTexit: __constraint_cdwTexit.getValue(),
    });
  }

  return result;
};
