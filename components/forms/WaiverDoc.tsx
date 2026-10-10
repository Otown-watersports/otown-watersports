/**
 * The O'Town Watersports release, reset as a real document (not a scan).
 * Legal text is verbatim from the original Florida-Release PDF (otownwatersports.com/about/waiver), wording and spelling unchanged.
 * Layout follows the original: grey title box, red emphasis, lettered sections, initial and signature lines.
 */

const Red = ({ children }: { children: React.ReactNode }) => <span className="wv-red">{children}</span>;
const Init = ({ dot }: { dot?: boolean }) => <> INITIAL<span className="wv-blank wv-blank--init" />{dot ? "." : ""}</>;
const Sig = ({ cols }: { cols: [string, string | null, string] }) => (
  <div className="wv-sig">
    <span><i />{cols[0]}</span>
    {cols[1] ? <span><i />{cols[1]}</span> : <span aria-hidden />}
    <span><i />{cols[2]}</span>
  </div>
);

export default function WaiverDoc() {
  return (
    <div className="wv">
      <article className="wv-page" aria-label="Page 1: adult release">
        <header className="wv-box">
          <p>WATER SPORTS PARTICIPATION</p>
          <p>UNCONDITIONAL GENERAL RELEASE FROM LIABILITY – ADULT (18+)</p>
        </header>

        <p className="wv-j">
          Please read the following agreement carefully <Red>BEFORE DECIDING TO PARTICIPATE.</Red> By signing this document and initialing the required sections,{" "}
          <Red>YOU ARE EXPRESSLY AGREEING TO HAVE KNOWLINGLY, FULLY AND TOTALLY RELEASED</Red> the Owner/Company/His Agents and Employees (hereinafter “the Released”){" "}
          <Red>FROM ANY AND ALL CLAIMS, INCLUDING ACTIVE OR PASSIVE NEGLIGENCE BUT EXCLUDING GROSS NEGLIGENCE AND/OR INTENTIONAL MISCONDUCT</Red>, arising out of any act, omission, or condition existing prior to the signing of the agreement, and extending to include any act, omission, or condition in any way connected with your participation in (including transit to and from) these water sports activities, occurring at any point in the future from the activities in which you are about to purchase/engage.
        </p>

        <h2 className="wv-h"><span>A.</span><u>EXPRESS ASSUMPTION OF ALL INHERENT RISKS OF WATER SPORTS ACTIVITIES</u></h2>
        <p className="wv-j">
          There are numerous risks inherent in and associated with participation in water sports activities. By executing this RELEASE, you are acknowledging that participation in water sports activities is an inherently dangerous activity that involves risks of death and/or serious bodily injury that cannot be prevented or avoided even by the exercise of reasonable care. The following list, though not exhaustive, exemplifies many of the types of risks and potential injuries you could encounter in connection with your participation in water sports.
        </p>
        <ul className="wv-list">
          <li>changing water flow, tides, currents, wave action, eddies, whirlpools, and vessel wakes;</li>
          <li>collision with other participants; collision with watercraft, whether owned or operated by the Released, collision with man-made or natural objects;</li>
          <li>the negligent actions and/or omissions of other participants;</li>
          <li>your own actions and/or omissions, your level of competency as to the activity, and your own physical and mental conditions;</li>
          <li>your sense of balance, physical coordination, ability to operate equipment, and ability to swim;</li>
          <li>wind shear, inclement weather, lightning, variances and extremes of wind, weather and temperature;</li>
          <li>collision, capsizing, sinking, falling, slipping or other hazards that may result in wetness, injury, exposure to the elements, hypothermia, impact of the body upon the water, injection of water into any body orifices, and/or drowning;</li>
          <li>the presence of insects, wild animals, as well as dangerous plant life, bacteria, amoebas, and marine life forms;</li>
          <li>equipment failure, improper use of equipment and/or impacting equipment;</li>
          <li>heat or sun related injuries or illnesses, including sunburn, sun stroke or dehydration;</li>
          <li>fatigue, chill, shock and/or dizziness which may increase your reaction time.</li>
        </ul>
        <p className="wv-j">
          By initialing this section and executing this WAIVER below, you are agreeing that you have reviewed the preceding non-exclusive list of sample inherent risks involved in your participation in these activities, and with full knowledge and understanding, you are voluntarily agreeing to engage and participate in these activities and to{" "}
          <b>VOLUNTARILY AND EXPRESSLY ASSUME THE RISK OF SERIOUS BODILY HARM, PERSONAL INJURY, DEATH OR DAMAGE</b> resulting from any and all inherent risks while participating and engaging in (including transit to and from) these water sports activities. By expressly assuming <Red>ANY AND ALL INHERENT RISKS</Red> involved with these water sports activities, you are voluntarily relinquishing the ability to seek or collect damages from the Released due to any personal injury, claim, or incident occurring or in any way related to or arising from the inherent risks of your involvement in these water sports activities.<Init />
        </p>

        <h2 className="wv-h"><span>B.</span><u>INDEMINITY AGREEMENT STATEMENT</u></h2>
        <p className="wv-j">
          By initialing this section and executing this WAIVER below, you are further agreeing to hold harmless and to indemnify the Released against any and all claims, demands, losses, damages, causes of action, judgments, costs, expenses, attorneys’ fees, and other liabilities, including those from third parties, arising out of or relating to your participation in any water sports and/or presence upon the property on which they are located, even if caused by the active or passive negligence of the Released, but excluding any gross negligence or intentional misconduct. By agreeing to indemnify the Released for the acts, occurrences, and expenses as contained within this subsection you are knowingly and voluntarily agreeing that you may be required to reimburse or provide the cost of a legal defense or representation for the Released for any expenses or actions it has to take arising out of your participation in these water sports activities.<Init />
        </p>

        <h2 className="wv-h"><span>C.</span><u>WAIVER AND RELEASE OF LIABILITY</u></h2>
        <p className="wv-j">
          By initialing this section and signing this WAIVER below,{" "}
          <b>YOU ARE AGREEING TO KNOWINGLY, VOLUNTARILY, AND UNEQUIVICALLY WAIVE ANY AND ALL CLAIMS, INCLUDING ACTIVE OR PASSIVE NEGLIGENCE BUT EXCLUDING GROSS NEGLIGENCE OR INTENTIONAL MISCONDUCT,</b>{" "}
          against the Released arising out of any act, omission, or condition existing prior to the signing of the agreement, and extending to any act, omission, or condition in any way connected with your participation in (including transit to and from) these water sports activities occurring at any point in the future. THIS WAIVER AND RELEASE OF LIABILITY IS EXPRESSLY PROVIDED TO EXCULPATE THE RELEASED FROM THOSE LIABILITIES WHICH ARE SEPARATE FROM AND IN ADDITION TO THE POTENTIAL LIABILITIES CREATED BY THE RISKS INHERENT IN WATER SPORTS PARTICIPATION. Furthermore, by initialing and signing this waiver below, you are binding your spouse, heirs, assigns, and any similarly situated personal or legal representative to the waiver’s terms.<br /><Init dot />
        </p>

        <h2 className="wv-h"><span>D.</span><u>DECLARATION OF COMPETENCY AND INTENT TO BE BOUND</u></h2>
        <p className="wv-j">
          By initialing this section and signing this WAIVER below, you are signifying that you have read first, then initialed, all sections contained within this agreement. You are further signifying that you are voluntarily agreeing to execute this waiver and release, and that you understand the legal implications and consequences of doing so. If there are any aspects of this agreement with which you do not have a full and complete understanding, you are encouraged to ask or inquire with the Released BEFORE initialing this section or signing this waiver.<Init dot />
        </p>

        <h2 className="wv-h"><span>E.</span><u>UNCONDITIONAL GENERAL RELEASE FROM LIABILITY</u></h2>
        <p className="wv-j">Your signature below reflects your express assent to be bound to the terms of this agreement. Please carefully review each section again and ensure that you fully understand the implications of this agreement.</p>

        <div className="wv-sigs">
          <Sig cols={["Printed Name of Adult Participant", "Signature of Adult Participant", "DATE"]} />
          <Sig cols={["Printed Name of Agent / Witness", "Signature of Agent / Witness", "DATE"]} />
        </div>
        <p className="wv-foot"><b>*EACH ADULT PARTICIPANT MUST INDIVIDUALLY SIGN A WAIVER. SEE ATTACHED SUPPLEMENTAL FORM FOR LIMITED WAIVER FOR MINOR CHILDREN</b></p>
        <p className="wv-num">1</p>
      </article>

      <article className="wv-page" aria-label="Page 2: release for minor children">
        <header className="wv-box">
          <p>WATER SPORTS PARTICIPATION</p>
          <p>LIMITED RELEASE FROM LIABILITY – MINOR CHILDREN (&lt;18)</p>
        </header>

        <h2 className="wv-c"><u>NOTICE TO THE MINOR CHILD&apos;S NATURAL GUARDIAN</u></h2>
        <p className="wv-notice">
          READ THIS FORM COMPLETELY AND CAREFULLY. YOU ARE AGREEING TO LET YOUR MINOR CHILD ENGAGE IN A POTENTIALLY DANGEROUS ACTIVITY. YOU ARE AGREEING THAT, EVEN IF THE RELEASED USES REASONABLE CARE IN PROVIDING THIS ACTIVITY, THERE IS A CHANCE YOUR CHILD MAY BE SERIOUSLY INJURED OR KILLED BY PARTICIPATING IN THIS ACTIVITY BECAUSE THERE ARE CERTAIN DANGERS INHERENT IN THE ACTIVITY WHICH CANNOT BE AVOIDED OR ELIMINATED. BY SIGNING THIS FORM YOU ARE GIVING UP YOUR CHILD&apos;S RIGHT AND YOUR RIGHT TO RECOVER FROM THE RELEASED IN A LAWSUIT FOR ANY PERSONAL INJURY, INCLUDING DEATH, TO YOUR CHILD OR ANY PROPERTY DAMAGE THAT RESULTS FROM THE RISKS THAT ARE A NATURAL PART OF THE ACTIVITY. YOU HAVE THE RIGHT TO REFUSE TO SIGN THIS FORM, AND THE RELEASED HAS THE RIGHT TO REFUSE TO LET YOUR CHILD PARTICIPATE IF YOU DO NOT SIGN THIS FORM.
        </p>

        <h2 className="wv-c wv-c--sm"><u>EFFECT OF FLORIDA LAW ON A LEGAL GUARDIAN’S ABILITY TO WAIVE CLAIMS OF NEGLIGENCE ON BEHALF OF COMMERICAL ENTITIES FOR INJURIES, DEATH OR LOSS EXPERIENCED BY THEIR MINOR CHILDREN</u></h2>
        <p className="wv-j">
          This supplemental waiver for minor children does not waive your minor child’s ability to recover against the Released for injuries, damages, or other loss occurring to the minor child, brought on behalf of the minor child by either you as natural guardian, personal representative, or guardian ad litem based on the negligence of the Released. By initialing this section and signing the waiver below, you are knowingly and voluntarily agreeing, and expressly acknowledging, that you have read the statement above regarding the waiver of your ability, as well as that of your minor child or his/her representative, to recover against the Released for any PERSONAL INJURY, INCLUDING DEATH, TO YOUR CHILD OR ANY PROPERTY DAMAGE THAT RESULTS FROM THE RISKS THAT ARE <u>A NATURAL PART OF THE ACTIVITY</u>. As provided by Fla. Stat. §744.301(3)(b) (2012), the term natural risk or otherwise construed as an “inherent risk” of the activity means those dangers or conditions, known or unknown, which are characteristic of, intrinsic to, or an integral part of the activity and which are not eliminated even if the activity provider acts with due care in a reasonably prudent manner. The term includes, but is not limited to the failure by the activity provider to warn the natural guardian or minor child of an inherent risk; and the risk that the minor child or another participant in the activity may act in a negligent or intentional manner and contribute to the injury or death of the minor child. The scope of this supplemental waiver shall be coextensive with that of the Adult Participant Waiver to the fullest extent allowed by state law.
        </p>

        <h2 className="wv-c wv-c--sm"><u>NATURAL GUARDIAN’S ACKNOWLEDGEMENT OF LIMITED RELEASE ON BEHALF OF MINOR CHILD</u></h2>
        <p className="wv-j">Your signature below reflects your express assent to be bound to the terms of this supplemental agreement for your minor child. Your signature also represents your attestation to being the natural guardian of the minor child(ren) listed below, and possessing the legal authority to sign this agreement on their behalf. Please carefully review each section again and ensure that you fully understand the implications of this agreement.</p>

        <div className="wv-sigs">
          <Sig cols={["Printed Name of Natural Guardian", "Signature of Natural Guardian", "DATE"]} />
          <Sig cols={["Printed Name of Minor Child", null, "DATE"]} />
          <Sig cols={["Printed Name of Minor Child", null, "DATE"]} />
          <Sig cols={["Printed Name of Minor Child", null, "DATE"]} />
        </div>
        <p className="wv-foot wv-foot--c"><b><u>**Failure of less than all natural guardians to sign this form on behalf of a minor child does not constitute a basis for waiver of the limitations granted herein**</u></b></p>
        <p className="wv-num">2</p>
      </article>
    </div>
  );
}
