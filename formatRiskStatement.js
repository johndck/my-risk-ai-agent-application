

function formatRiskStatement(data) {
    const { if_Cause, then_Event, resultingIn_Consequence } = data.riskComponents;
    return `There is a risk that if ${if_Cause}, then ${then_Event}, resulting in ${resultingIn_Consequence}.`;
  }

  export default formatRiskStatement

  