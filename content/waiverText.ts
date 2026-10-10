/**
 * Plain-text copy of the O'Town release (verbatim from components/forms/WaiverDoc.tsx).
 * Used by the online signing form and the signed PDF. If the wording changes, update both and bump WAIVER_VERSION.
 */
export const WAIVER_VERSION = "2026-10 (Florida release, adult + minor)";

export type WaiverBlock = { t: "h" | "p" | "li"; text: string; initial?: "A" | "B" | "C" | "D" | "M" };
export type WaiverPage = { title: string[]; blocks: WaiverBlock[] };

export const WAIVER_PAGES: WaiverPage[] = [
  {
    "title": [
      "WATER SPORTS PARTICIPATION",
      "UNCONDITIONAL GENERAL RELEASE FROM LIABILITY – ADULT (18+)"
    ],
    "blocks": [
      {
        "t": "p",
        "text": "Please read the following agreement carefully BEFORE DECIDING TO PARTICIPATE. By signing this document and initialing the required sections, YOU ARE EXPRESSLY AGREEING TO HAVE KNOWLINGLY, FULLY AND TOTALLY RELEASED the Owner/Company/His Agents and Employees (hereinafter “the Released”) FROM ANY AND ALL CLAIMS, INCLUDING ACTIVE OR PASSIVE NEGLIGENCE BUT EXCLUDING GROSS NEGLIGENCE AND/OR INTENTIONAL MISCONDUCT, arising out of any act, omission, or condition existing prior to the signing of the agreement, and extending to include any act, omission, or condition in any way connected with your participation in (including transit to and from) these water sports activities, occurring at any point in the future from the activities in which you are about to purchase/engage."
      },
      {
        "t": "h",
        "text": "A. EXPRESS ASSUMPTION OF ALL INHERENT RISKS OF WATER SPORTS ACTIVITIES"
      },
      {
        "t": "p",
        "text": "There are numerous risks inherent in and associated with participation in water sports activities. By executing this RELEASE, you are acknowledging that participation in water sports activities is an inherently dangerous activity that involves risks of death and/or serious bodily injury that cannot be prevented or avoided even by the exercise of reasonable care. The following list, though not exhaustive, exemplifies many of the types of risks and potential injuries you could encounter in connection with your participation in water sports."
      },
      {
        "t": "li",
        "text": "changing water flow, tides, currents, wave action, eddies, whirlpools, and vessel wakes;"
      },
      {
        "t": "li",
        "text": "collision with other participants; collision with watercraft, whether owned or operated by the Released, collision with man-made or natural objects;"
      },
      {
        "t": "li",
        "text": "the negligent actions and/or omissions of other participants;"
      },
      {
        "t": "li",
        "text": "your own actions and/or omissions, your level of competency as to the activity, and your own physical and mental conditions;"
      },
      {
        "t": "li",
        "text": "your sense of balance, physical coordination, ability to operate equipment, and ability to swim;"
      },
      {
        "t": "li",
        "text": "wind shear, inclement weather, lightning, variances and extremes of wind, weather and temperature;"
      },
      {
        "t": "li",
        "text": "collision, capsizing, sinking, falling, slipping or other hazards that may result in wetness, injury, exposure to the elements, hypothermia, impact of the body upon the water, injection of water into any body orifices, and/or drowning;"
      },
      {
        "t": "li",
        "text": "the presence of insects, wild animals, as well as dangerous plant life, bacteria, amoebas, and marine life forms;"
      },
      {
        "t": "li",
        "text": "equipment failure, improper use of equipment and/or impacting equipment;"
      },
      {
        "t": "li",
        "text": "heat or sun related injuries or illnesses, including sunburn, sun stroke or dehydration;"
      },
      {
        "t": "li",
        "text": "fatigue, chill, shock and/or dizziness which may increase your reaction time."
      },
      {
        "t": "p",
        "text": "By initialing this section and executing this WAIVER below, you are agreeing that you have reviewed the preceding non-exclusive list of sample inherent risks involved in your participation in these activities, and with full knowledge and understanding, you are voluntarily agreeing to engage and participate in these activities and to VOLUNTARILY AND EXPRESSLY ASSUME THE RISK OF SERIOUS BODILY HARM, PERSONAL INJURY, DEATH OR DAMAGE resulting from any and all inherent risks while participating and engaging in (including transit to and from) these water sports activities. By expressly assuming ANY AND ALL INHERENT RISKS involved with these water sports activities, you are voluntarily relinquishing the ability to seek or collect damages from the Released due to any personal injury, claim, or incident occurring or in any way related to or arising from the inherent risks of your involvement in these water sports activities.",
        "initial": "A"
      },
      {
        "t": "h",
        "text": "B. INDEMINITY AGREEMENT STATEMENT"
      },
      {
        "t": "p",
        "text": "By initialing this section and executing this WAIVER below, you are further agreeing to hold harmless and to indemnify the Released against any and all claims, demands, losses, damages, causes of action, judgments, costs, expenses, attorneys’ fees, and other liabilities, including those from third parties, arising out of or relating to your participation in any water sports and/or presence upon the property on which they are located, even if caused by the active or passive negligence of the Released, but excluding any gross negligence or intentional misconduct. By agreeing to indemnify the Released for the acts, occurrences, and expenses as contained within this subsection you are knowingly and voluntarily agreeing that you may be required to reimburse or provide the cost of a legal defense or representation for the Released for any expenses or actions it has to take arising out of your participation in these water sports activities.",
        "initial": "B"
      },
      {
        "t": "h",
        "text": "C. WAIVER AND RELEASE OF LIABILITY"
      },
      {
        "t": "p",
        "text": "By initialing this section and signing this WAIVER below, YOU ARE AGREEING TO KNOWINGLY, VOLUNTARILY, AND UNEQUIVICALLY WAIVE ANY AND ALL CLAIMS, INCLUDING ACTIVE OR PASSIVE NEGLIGENCE BUT EXCLUDING GROSS NEGLIGENCE OR INTENTIONAL MISCONDUCT, against the Released arising out of any act, omission, or condition existing prior to the signing of the agreement, and extending to any act, omission, or condition in any way connected with your participation in (including transit to and from) these water sports activities occurring at any point in the future. THIS WAIVER AND RELEASE OF LIABILITY IS EXPRESSLY PROVIDED TO EXCULPATE THE RELEASED FROM THOSE LIABILITIES WHICH ARE SEPARATE FROM AND IN ADDITION TO THE POTENTIAL LIABILITIES CREATED BY THE RISKS INHERENT IN WATER SPORTS PARTICIPATION. Furthermore, by initialing and signing this waiver below, you are binding your spouse, heirs, assigns, and any similarly situated personal or legal representative to the waiver’s terms.",
        "initial": "C"
      },
      {
        "t": "h",
        "text": "D. DECLARATION OF COMPETENCY AND INTENT TO BE BOUND"
      },
      {
        "t": "p",
        "text": "By initialing this section and signing this WAIVER below, you are signifying that you have read first, then initialed, all sections contained within this agreement. You are further signifying that you are voluntarily agreeing to execute this waiver and release, and that you understand the legal implications and consequences of doing so. If there are any aspects of this agreement with which you do not have a full and complete understanding, you are encouraged to ask or inquire with the Released BEFORE initialing this section or signing this waiver.",
        "initial": "D"
      },
      {
        "t": "h",
        "text": "E. UNCONDITIONAL GENERAL RELEASE FROM LIABILITY"
      },
      {
        "t": "p",
        "text": "Your signature below reflects your express assent to be bound to the terms of this agreement. Please carefully review each section again and ensure that you fully understand the implications of this agreement."
      },
      {
        "t": "p",
        "text": "*EACH ADULT PARTICIPANT MUST INDIVIDUALLY SIGN A WAIVER. SEE ATTACHED SUPPLEMENTAL FORM FOR LIMITED WAIVER FOR MINOR CHILDREN"
      }
    ]
  },
  {
    "title": [
      "WATER SPORTS PARTICIPATION",
      "LIMITED RELEASE FROM LIABILITY – MINOR CHILDREN (<18)"
    ],
    "blocks": [
      {
        "t": "h",
        "text": "NOTICE TO THE MINOR CHILD'S NATURAL GUARDIAN"
      },
      {
        "t": "p",
        "text": "READ THIS FORM COMPLETELY AND CAREFULLY. YOU ARE AGREEING TO LET YOUR MINOR CHILD ENGAGE IN A POTENTIALLY DANGEROUS ACTIVITY. YOU ARE AGREEING THAT, EVEN IF THE RELEASED USES REASONABLE CARE IN PROVIDING THIS ACTIVITY, THERE IS A CHANCE YOUR CHILD MAY BE SERIOUSLY INJURED OR KILLED BY PARTICIPATING IN THIS ACTIVITY BECAUSE THERE ARE CERTAIN DANGERS INHERENT IN THE ACTIVITY WHICH CANNOT BE AVOIDED OR ELIMINATED. BY SIGNING THIS FORM YOU ARE GIVING UP YOUR CHILD'S RIGHT AND YOUR RIGHT TO RECOVER FROM THE RELEASED IN A LAWSUIT FOR ANY PERSONAL INJURY, INCLUDING DEATH, TO YOUR CHILD OR ANY PROPERTY DAMAGE THAT RESULTS FROM THE RISKS THAT ARE A NATURAL PART OF THE ACTIVITY. YOU HAVE THE RIGHT TO REFUSE TO SIGN THIS FORM, AND THE RELEASED HAS THE RIGHT TO REFUSE TO LET YOUR CHILD PARTICIPATE IF YOU DO NOT SIGN THIS FORM."
      },
      {
        "t": "h",
        "text": "EFFECT OF FLORIDA LAW ON A LEGAL GUARDIAN’S ABILITY TO WAIVE CLAIMS OF NEGLIGENCE ON BEHALF OF COMMERICAL ENTITIES FOR INJURIES, DEATH OR LOSS EXPERIENCED BY THEIR MINOR CHILDREN"
      },
      {
        "t": "p",
        "text": "This supplemental waiver for minor children does not waive your minor child’s ability to recover against the Released for injuries, damages, or other loss occurring to the minor child, brought on behalf of the minor child by either you as natural guardian, personal representative, or guardian ad litem based on the negligence of the Released. By initialing this section and signing the waiver below, you are knowingly and voluntarily agreeing, and expressly acknowledging, that you have read the statement above regarding the waiver of your ability, as well as that of your minor child or his/her representative, to recover against the Released for any PERSONAL INJURY, INCLUDING DEATH, TO YOUR CHILD OR ANY PROPERTY DAMAGE THAT RESULTS FROM THE RISKS THAT ARE A NATURAL PART OF THE ACTIVITY. As provided by Fla. Stat. §744.301(3)(b) (2012), the term natural risk or otherwise construed as an “inherent risk” of the activity means those dangers or conditions, known or unknown, which are characteristic of, intrinsic to, or an integral part of the activity and which are not eliminated even if the activity provider acts with due care in a reasonably prudent manner. The term includes, but is not limited to the failure by the activity provider to warn the natural guardian or minor child of an inherent risk; and the risk that the minor child or another participant in the activity may act in a negligent or intentional manner and contribute to the injury or death of the minor child. The scope of this supplemental waiver shall be coextensive with that of the Adult Participant Waiver to the fullest extent allowed by state law.",
        "initial": "M"
      },
      {
        "t": "h",
        "text": "NATURAL GUARDIAN’S ACKNOWLEDGEMENT OF LIMITED RELEASE ON BEHALF OF MINOR CHILD"
      },
      {
        "t": "p",
        "text": "Your signature below reflects your express assent to be bound to the terms of this supplemental agreement for your minor child. Your signature also represents your attestation to being the natural guardian of the minor child(ren) listed below, and possessing the legal authority to sign this agreement on their behalf. Please carefully review each section again and ensure that you fully understand the implications of this agreement."
      },
      {
        "t": "p",
        "text": "**Failure of less than all natural guardians to sign this form on behalf of a minor child does not constitute a basis for waiver of the limitations granted herein**"
      }
    ]
  }
];
