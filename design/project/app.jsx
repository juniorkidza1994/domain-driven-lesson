// app.jsx — DesignCanvas presenting all artboards
const { useState: appUseState } = React;

function App() {
  return (
    <DesignCanvas title="DDD Lesson — Mobile-first UI" subtitle="iPhone 375 primary · 1280 desktop as reference">
      <DCSection id="mobile" title="Mobile · 375px · Primary" subtitle="Tall full-scroll artboards. Tap hamburger to open the drawer; tap any indigo dotted term in Module to open a bottom sheet.">
        <DCArtboard id="m-landing" label="01 · Landing" width={375} height={1620}>
          <LandingMobile lang="en"/>
        </DCArtboard>
        <DCArtboard id="m-module"  label="02 · Module · Reading + Quiz" width={375} height={3700}>
          <ModuleMobile lang="en"/>
        </DCArtboard>
        <DCArtboard id="m-glossary" label="03 · Glossary" width={375} height={1880}>
          <GlossaryMobile lang="en"/>
        </DCArtboard>
      </DCSection>

      <DCSection id="mobile-th" title="Mobile · Thai (Sarabun)" subtitle="Same components rendered through the Thai locale.">
        <DCArtboard id="m-landing-th" label="01 · TH · Landing" width={375} height={1620}>
          <LandingMobile lang="th"/>
        </DCArtboard>
        <DCArtboard id="m-glossary-th" label="03 · TH · Glossary" width={375} height={1880}>
          <GlossaryMobile lang="th"/>
        </DCArtboard>
      </DCSection>

      <DCSection id="desktop" title="Desktop · 1280px · Reference" subtitle="How the same components expand on a laptop. Hamburger collapses into a tab bar, hero opens up, cards form a 3-column grid.">
        <DCArtboard id="d-landing"  label="Landing · 1280"  width={1280} height={1980}>
          <LandingDesktop lang="en"/>
        </DCArtboard>
        <DCArtboard id="d-module"   label="Module · 1280"   width={1280} height={1820}>
          <ModuleDesktop lang="en"/>
        </DCArtboard>
        <DCArtboard id="d-glossary" label="Glossary · 1280" width={1280} height={1500}>
          <GlossaryDesktop lang="en"/>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
