import {
  type VM,
  type List,
  type IC,
  Variable,
  createInnerClass,
  Predicate,
} from "./libs";
import { Member, Test } from "./buildIn";

export class TRn implements Predicate {
  private _aUXPinList: Variable;
  private _ModelList: Variable;
  private _pinList: Variable;
  private _cwTentList: Variable;
  private _cdwTentList: Variable;
  private _cdwWList: Variable;
  private _cwWList: Variable;
  private _cwTexit: Variable;
  private _cOP: Variable;
  private _cdwTexit: Variable;
  private cont: Predicate;

  public constructor(
    _aUXPinList: Variable,
    _ModelList: Variable,
    _pinList: Variable,
    _cwTentList: Variable,
    _cdwTentList: Variable,
    _cdwWList: Variable,
    _cwWList: Variable,
    _cwTexit: Variable,
    _cOP: Variable,
    _cdwTexit: Variable,
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
    this.cont = cont;
  }

  public exec(vm: VM): Predicate {
    return new this.Method_1().exec(vm);
  }

  public Method_1: IC = createInnerClass(this).with(
    (outerThis) =>
      class implements Predicate {
        private _pin: Variable;
        private _aUXPin: Variable;
        private _Model: Variable;
        private _cwTent: Variable;
        private _cdwTent: Variable;
        private _cdwW: Variable;
        private _cwW: Variable;
        private _q: Variable;
        private _p: Variable;
        private _rad: Variable;

        public exec(vm: VM): Predicate {
          return this.method_1_cu1.exec(vm);
        }

        public Method_1_cu1: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return Member(
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
                return Member(
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
                return Member(
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
                return Member(
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
                return Member(
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
                  13.86 * methodThis._pin.getValue() +
                    90895.9 * methodThis._cwTent.getValue() +
                    -66323.2 * methodThis._cdwTent.getValue() +
                    0 * methodThis._cwW.getValue() +
                    0 * methodThis._cdwW.getValue() +
                    -0.0000366418 *
                      methodThis._pin.getValue() *
                      methodThis._pin.getValue() +
                    -0.384187 *
                      methodThis._pin.getValue() *
                      methodThis._cwTent.getValue() +
                    0.220356 *
                      methodThis._pin.getValue() *
                      methodThis._cdwTent.getValue() +
                    78.8856 *
                      methodThis._pin.getValue() *
                      methodThis._cwW.getValue() +
                    6.98206 *
                      methodThis._pin.getValue() *
                      methodThis._cdwW.getValue() +
                    -2751.02 *
                      methodThis._cwTent.getValue() *
                      methodThis._cwTent.getValue() +
                    2906.12 *
                      methodThis._cwTent.getValue() *
                      methodThis._cdwTent.getValue() +
                    0 *
                      methodThis._cwTent.getValue() *
                      methodThis._cwW.getValue() +
                    0 *
                      methodThis._cwTent.getValue() *
                      methodThis._cdwW.getValue() +
                    -1051.24 *
                      methodThis._cdwTent.getValue() *
                      methodThis._cdwTent.getValue() +
                    0 *
                      methodThis._cdwTent.getValue() *
                      methodThis._cwW.getValue() +
                    0 *
                      methodThis._cdwTent.getValue() *
                      methodThis._cdwW.getValue() +
                    0 *
                      methodThis._cwW.getValue() *
                      methodThis._cwW.getValue() +
                    0 *
                      methodThis._cwW.getValue() *
                      methodThis._cdwW.getValue() +
                    0 *
                      methodThis._cdwW.getValue() *
                      methodThis._cdwW.getValue() +
                    0
                );
                return methodThis.method_1_cu7;
              }
            }
        );

        public Method_1_cu7: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                outerThis._cwTexit.setValue(
                  methodThis._cwTent.getValue() -
                    (methodThis._q.getValue() / 4.186) *
                      methodThis._cwW.getValue() *
                      10 ** 6
                );
                if (
                  !(
                    0 < outerThis._cwTexit.getValue() &&
                    outerThis._cwTexit.getValue() < 100
                  )
                ) {
                  return Predicate.failure;
                }
                return methodThis.method_1_cu8;
              }
            }
        );

        public Method_1_cu8: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return Member(
                  methodThis._aUXPin,
                  outerThis._aUXPinList,
                  methodThis.method_1_cu9
                );
              }
            }
        );

        public Method_1_cu9: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                methodThis._p.setValue(
                  methodThis._pin.getValue() + methodThis._aUXPin.getValue()
                );
                return methodThis.method_1_cu10;
              }
            }
        );

        public Method_1_cu10: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                outerThis._cOP.setValue(
                  methodThis._q.getValue() / methodThis._p.getValue()
                );
                if (!(5 < outerThis._cOP.getValue())) {
                  return Predicate.failure;
                }
                return methodThis.method_1_cu11;
              }
            }
        );

        public Method_1_cu11: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                methodThis._rad.setValue(
                  methodThis._q.getValue() + methodThis._p.getValue()
                );
                return methodThis.method_1_cu12;
              }
            }
        );

        public Method_1_cu12: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                outerThis._cdwTexit.setValue(
                  methodThis._cdwTent.getValue() +
                    (methodThis._rad.getValue() / 4.186) *
                      methodThis._cdwW.getValue() *
                      10 ** 6
                );
                if (
                  !(
                    0 < outerThis._cdwTexit.getValue() &&
                    outerThis._cdwTexit.getValue() < 100
                  )
                ) {
                  return Predicate.failure;
                }
                return methodThis.method_1_cu13;
              }
            }
        );

        public Method_1_cu13: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return Member(
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
        private method_1_cu11 = new this.Method_1_cu11();
        private method_1_cu12 = new this.Method_1_cu12();
        private method_1_cu13 = new this.Method_1_cu13();
      }
  );
}
