import solve from "@/solve";
import { HashSet } from "@/structures/hash-set";
import { stripIndents } from "common-tags";

const exampleInput = stripIndents`
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`;

const findConnections = (input: string, selfInclude: boolean) => {
  const pairs = input.split("\n").map((line) => line.split("-"));
  const computers = new Map<string, Set<string>>();

  pairs.forEach(([a, b]) => {
    if (!computers.has(a)) {
      const set = selfInclude ? new Set([a]) : new Set<string>();
      computers.set(a, set);
    }
    if (!computers.has(b)) {
      const set = selfInclude ? new Set([b]) : new Set<string>();
      computers.set(b, set);
    }

    computers.get(a)!.add(b);
    computers.get(b)!.add(a);
  });

  return computers;
};

const findInterConnected = (computers: Map<string, Set<string>>) => {
  const keys = Array.from(computers.keys());

  const interConnected = new HashSet<string, string[]>((names) =>
    names.toSorted().join("-")
  );

  keys.forEach((key1) => {
    const set1 = computers.get(key1)!;

    set1.forEach((key2) => {
      if (key1 === key2) return;

      const set2 = computers.get(key2)!;
      const inter1 = set1.intersection(set2);

      if (inter1.size < 3) return;

      const third = inter1.difference(new Set([key1, key2]));
      third.forEach((key3) => {
        interConnected.add([key1, key2, key3]);
      });
    });
  });

  return interConnected;
};

solve({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 7,
      },
    ],
    fn: (input) => {
      const computers = findConnections(input, true);
      const interConnected = Array.from(findInterConnected(computers));

      const tStarted = interConnected.filter((keys) =>
        keys.some((key) => key.startsWith("t"))
      );

      return tStarted.length;
    },
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: "co,de,ka,ta",
      },
    ],
    fn: (input) => {
      const computers = findConnections(input, false);
      let max = 0;
      let maxSet: Set<string> | null = null;

      const bronKerbosch = (R: Set<string>, P: Set<string>, X: Set<string>) => {
        if (P.size === 0 && X.size === 0) {
          if (R.size > max) {
            max = R.size;
            maxSet = new Set(R);
          }
          return;
        }
        for (const v of P) {
          const connected = computers.get(v)!;
          connected.delete(v);

          bronKerbosch(
            R.union(new Set([v])),
            P.intersection(connected),
            X.intersection(connected)
          );
          P.delete(v);
          X.add(v);
        }
      };

      bronKerbosch(new Set(), new Set(computers.keys()), new Set());

      return [...maxSet!].sort().join(",");
    },
  },
});
