import {
  type VM,
  type List,
  type IC,
  Variable,
  createInnerClass,
  Predicate,
} from "./libs";
import { Member, Test } from "./buildIn";

export class SampleGoal implements Predicate {
  private x: Variable;
  private y: Variable;
  private constraintX: Variable;
  private constraintY: Variable;
  private l1: List;
  private l2: List;
  private cont: Predicate;

  public constructor(
    x: Variable,
    y: Variable,
    constraintX: Variable,
    constraintY: Variable,
    l1: List,
    l2: List,
    cont: Predicate
  ) {
    this.x = x;
    this.y = y;
    this.constraintX = constraintX;
    this.constraintY = constraintY;
    this.l1 = l1;
    this.l2 = l2;
    this.cont = cont;
  }

  public exec(vm: VM): Predicate {
    return new this.Method().exec(vm);
  }

  public Method: IC = createInnerClass(this).with(
    (outerThis) =>
      class implements Predicate {
        private a: Variable = new Variable();
        private b: Variable = new Variable();

        public exec(vm: VM) {
          return this.cu1.exec(vm);
        }

        public Method_cu1: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(methodThis.a, outerThis.l1, methodThis.cu2);
              }
            }
        );

        public Method_cu2: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Member(methodThis.b, outerThis.l2, methodThis.cu3);
              }
            }
        );

        public Method_cu3: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new SampleCal(
                  methodThis.a,
                  methodThis.b,
                  outerThis.x,
                  outerThis.y,
                  outerThis.constraintX,
                  outerThis.constraintY,
                  methodThis.cu4
                );
              }
            }
        );

        public Method_cu4: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                if (
                  !outerThis.constraintX.getValue() ||
                  !outerThis.constraintY.getValue()
                ) {
                  return Predicate.failure;
                }
                return outerThis.cont;
              }
            }
        );

        private cu1 = new this.Method_cu1();
        private cu2 = new this.Method_cu2();
        private cu3 = new this.Method_cu3();
        private cu4 = new this.Method_cu4();
      }
  );
}

class SampleCal implements Predicate {
  private x: Variable;
  private y: Variable;
  private constraintX: Variable;
  private constraintY: Variable;
  private a: Variable;
  private b: Variable;
  private cont: Predicate;

  public constructor(
    a: Variable,
    b: Variable,
    x: Variable,
    y: Variable,
    constraintX: Variable,
    constraintY: Variable,
    cont: Predicate
  ) {
    this.a = a;
    this.b = b;
    this.x = x;
    this.y = y;
    this.constraintX = constraintX;
    this.constraintY = constraintY;
    this.cont = cont;
  }

  public exec(vm: VM): Predicate {
    return new this.Method().exec(vm);
  }

  public Method: IC = createInnerClass(this).with(
    (outerThis) =>
      class implements Predicate {
        public exec(vm: VM) {
          return this.cu1.exec(vm);
        }

        public Method_cu1: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                // return new XCal(outerThis.a, outerThis.b, outerThis.x, cu2);
                const r: Variable = outerThis.a.add(outerThis.b);
                outerThis.x.setValue(r.getValue());
                return methodThis.cu2.exec(vm);
              }
            }
        );

        public Method_cu2: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new ConstraintXCal(
                  outerThis.x,
                  outerThis.constraintX,
                  methodThis.cu3
                );
              }
            }
        );

        public Method_cu3: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                // return new YCal(outerThis.a, outerThis.b, outerThis.x, cu2);
                // const r: Variable = outerThis.a.sub(outerThis.b);
                outerThis.y.setValue(outerThis.a.sub(outerThis.b).getValue());
                return methodThis.cu4.exec(vm);
              }
            }
        );

        public Method_cu4: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new ConstraintYCal(
                  outerThis.y,
                  outerThis.constraintY,
                  outerThis.cont
                );
              }
            }
        );

        private cu1 = new this.Method_cu1();
        private cu2 = new this.Method_cu2();
        private cu3 = new this.Method_cu3();
        private cu4 = new this.Method_cu4();
      }
  );
}

class ConstraintXCal implements Predicate {
  private x: Variable;
  private constraintX: Variable;
  private cont: Predicate;

  public constructor(x: Variable, constraintX: Variable, cont: Predicate) {
    this.x = x;
    this.constraintX = constraintX;
    this.cont = cont;
  }

  public exec(vm: VM): Predicate {
    return new this.Method().exec(vm);
  }

  public Method: IC = createInnerClass(this).with(
    (outerThis) =>
      class implements Predicate {
        private r1: Variable = new Variable();
        private r2: Variable = new Variable();

        public exec(vm: VM) {
          return this.cu1.exec(vm);
        }

        public Method_cu1: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Test(
                  outerThis.x.getNumberValue() > 0,
                  methodThis.cu2
                );
              }
            }
        );

        public Method_cu2: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Test(
                  outerThis.x.getNumberValue() < 10,
                  methodThis.cu3
                );
              }
            }
        );

        public Method_1_cu3: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                if (methodThis.r1.getValue() && methodThis.r2.getValue()) {
                  outerThis.constraintX.setValue(true);
                  return outerThis.cont;
                }
                return Predicate.failure;
              }
            }
        );

        private cu1 = new this.Method_cu1();
        private cu2 = new this.Method_cu2();
        private cu3 = new this.Method_1_cu3();
      }
  );
}

class ConstraintYCal implements Predicate {
  private y: Variable;
  private constraintY: Variable;
  private cont: Predicate;

  public constructor(y: Variable, constraintY: Variable, cont: Predicate) {
    this.y = y;
    this.constraintY = constraintY;
    this.cont = cont;
  }

  public exec(vm: VM): Predicate {
    return new this.Method().exec(vm);
  }

  public Method: IC = createInnerClass(this).with(
    (outerThis) =>
      class implements Predicate {
        private r1: Variable = new Variable();
        private r2: Variable = new Variable();

        public exec(vm: VM) {
          return this.cu1.exec(vm);
        }

        public Method_cu1: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Test(
                  outerThis.y.getNumberValue() > 0,
                  methodThis.cu2
                );
              }
            }
        );

        public Method_cu2: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                return new Test(
                  outerThis.y.getNumberValue() < 10,
                  methodThis.cu3
                );
              }
            }
        );

        public Method_1_cu3: IC = createInnerClass(this).with(
          (methodThis) =>
            class implements Predicate {
              public exec(vm: VM) {
                if (methodThis.r1.getValue() && methodThis.r2.getValue()) {
                  outerThis.constraintY.setValue(true);
                  return outerThis.cont;
                }
                return Predicate.failure;
              }
            }
        );

        private cu1 = new this.Method_cu1();
        private cu2 = new this.Method_cu2();
        private cu3 = new this.Method_1_cu3();
      }
  );
}
