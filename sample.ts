import type { VM, Predicate, Variable, List } from "./libs";
import { Member, Test } from "./buildIn";

export class MembersTest implements Predicate {
  public cont: Predicate;
  public x: Variable;
  public y: Variable;
  public l1: List;
  public l2: List;
  public dec: Decision;

  public constructor(
    x: Variable,
    y: Variable,
    l1: List,
    l2: List,
    dec: Decision,
    cont: Predicate
  ) {
    this.x = x;
    this.y = y;
    this.l1 = l1;
    this.l2 = l2;
    this.dec = dec;
    this.cont = cont;
  }

  public exec(vm: VM): Predicate {
    const { exec } = this.Method_1();
    return exec(vm);
  }

  private Method_1 = () => {
    const m1 = new Member();
    const m2 = new Member();
    const t = new Test();

    const Method_1_cu1 = () => {
      return {
        exec: (vm: VM): Predicate => {
          const { exec } = Method_1_cu2();
          m1.init(this.x, this.l1, () => exec(vm));
          return m1 as Predicate;
        },
      };
    };

    const Method_1_cu2 = () => {
      return {
        exec: (vm: VM): Predicate => {
          const { exec } = Method_1_cu3();
          m2.init(this.y, this.l2, () => exec(vm));
          return m2 as Predicate;
        },
      };
    };

    const Method_1_cu3 = () => {
      return {
        exec: (vm: VM): Predicate => {
          this.x = m1.getArg();
          this.y = m2.getArg();
          t.init(this.x, this.y, this.dec, this.cont);
          return t as Predicate;
        },
      };
    };

    return {
      exec: (vm: VM): Predicate => {
        const { exec } = Method_1_cu1();
        return exec(vm);
      },
    };
  }

  public printArg(): void {
    console.log("x =", this.x.toString());
    console.log("y =", this.y.toString());
  }

  public getArg(): Variable {
    return this.x;
  }

}
