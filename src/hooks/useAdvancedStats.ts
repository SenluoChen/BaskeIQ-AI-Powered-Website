import { useMemo } from "react";

export type AdvInputs = {
  FTA: number; FTM: number; ORB: number; DRB: number;
  oppDRB: number; oppPoints: number; oppFGA: number; oppFTA: number; oppTOV: number;
};

export function useAdvancedStats(shots: any[], totals: { points:number; tov:number; ast:number; reb:number }, inputs: AdvInputs) {
  return useMemo(() => {
    let FGA=0, FGM=0, _3PA=0, _3PM=0;
    for (const s of shots ?? []) {
      const made = typeof s.made==='boolean'? s.made : Boolean(s.isMade||s.success);
      const isThree = typeof s.isThree==='boolean'
        ? s.isThree
        : (s.points===3) || /3|three/i.test(String(s.type ?? s.shotType ?? ""));
      FGA++; if(made) FGM++; if(isThree){ _3PA++; if(made) _3PM++; }
    }
    const { FTA, ORB, oppDRB, oppPoints } = inputs;
    const eFG  = FGA>0 ? (FGM + 0.5*_3PM)/FGA : 0;
    const TS   = (FGA+0.44*FTA)>0 ? totals.points/(2*(FGA+0.44*FTA)) : 0;
    const poss = FGA + 0.44*FTA - ORB + totals.tov;              // 單隊估算
    const offR = poss>0 ? (totals.points/poss)*100 : 0;
    const defR = poss>0 && oppPoints>0 ? (oppPoints/poss)*100 : 0;
    const netR = offR - defR;
    const TOVp = poss>0 ? totals.tov/poss : 0;
    const ORBp = (ORB+oppDRB)>0 ? ORB/(ORB+oppDRB) : 0;

    return { FGA, FGM, _3PA, _3PM, eFG, TS, poss, offR, defR, netR, TOVp, ORBp };
  }, [shots, totals, inputs]);
}
