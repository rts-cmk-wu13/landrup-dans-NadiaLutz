import styles from "./HoldTyper.module.scss";


export default function HoldTyper() {
  return <section id="vores-holdtyper" className={styles.holdTyper}>
    
  <h1 className={styles.holdTypeTitle}>Vores holdtyper</h1>

    <article className={styles.holdType}>
       <h2 className={styles.holdTypeSubtitle}>Børnehold</h2>
       <img className={styles.holdTypeImg} src="/imgs/boernedans.jpg" alt="Børnehold" />
       <p className={styles.holdTypeText}>På børneholdene leger vi os ind i dansens verden gennem musik, bevægelse og fantasi. Undervisningen styrker motorik, rytme og kropsbevidsthed i trygge rammer. Fokus er på danseglæde, fællesskab og aktiv bevægelse, hvor alle kan være med.</p>
     </article>

      <article className={styles.holdType}>
       <h2 className={styles.holdTypeSubtitle}>Selskabs- og seniordans</h2>
       <img className={styles.holdTypeImg} src="/imgs/seniordans.jpg" alt="Seniordans" />
       <p className={styles.holdTypeText}>Selskabs- og seniordans kombinerer hyggeligt samvær med skånsom motion. Vi danser klassiske pardanse i et tempo, hvor alle kan følge med. Undervisningen styrker balance, koordination og kondition, samtidig med at fællesskabet og danseglæden er i centrum.</p>
     </article>

      <article className={styles.holdType}>
       <h2 className={styles.holdTypeSubtitle}>Moderne dans og ballet</h2>
       <img className={styles.holdTypeImg} src="/imgs/modernedans.jpg" alt="Moderne dans og ballet" />
       <p className={styles.holdTypeText}>Moderne dans og ballet forener teknik, kropskontrol og musikalsk udtryk. Træningen forbedrer styrke, smidighed og holdning gennem varierede øvelser. Undervisningen foregår i en positiv atmosfære, hvor bevægelsesglæde og koncentration skaber både fordybelse og effektiv motion.</p>
     </article>

      <article className={styles.holdType}>
       <h2 className={styles.holdTypeSubtitle}>Streetdance og hiphop</h2>
       <img className={styles.holdTypeImg} src="/imgs/streethiphop.jpg" alt="Street og hiphop" />
       <p className={styles.holdTypeText}>Streetdance og hiphop er energifyldt træning med fokus på rytme, attitude og fællesskab. Vi arbejder med grooves, koreografier og grundtrin, der styrker kondition og koordination. Stemningen er uformel og motiverende, så motion og danseglæde går hånd i hånd.</p>
     </article>
     
     
     </section>
}


