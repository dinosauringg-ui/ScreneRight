import { Button } from "../ui/button";
import { useAppStore } from "../../store";
import { jsPDF } from "jspdf";
import { DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

export const PDFExportOptions = ({ onClose }: { onClose: () => void }) => {
  const { scriptBlocks } = useAppStore();

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("courier", "normal");
    doc.setFontSize(12);

    let y = 20;
    const marginL = 20;
    const pageH = doc.internal.pageSize.getHeight();

    scriptBlocks.forEach((block) => {
      // Very basic formatting mapping for jsPDF
      let x = marginL;
      let maxWidth = 170;
      let text = block.text;

      switch (block.type) {
        case "slugline":
          text = text.toUpperCase();
          break;
        case "action":
          break;
        case "character":
          x = 80;
          maxWidth = 100;
          text = text.toUpperCase();
          break;
        case "parenthetical":
          x = 65;
          maxWidth = 60;
          text = `(${text.replace(/^\(|\)$/g, "")})`;
          break;
        case "dialogue":
          x = 50;
          maxWidth = 110;
          break;
      }

      const lines = doc.splitTextToSize(text, maxWidth);
      
      if (y + lines.length * 5 > pageH - 20) {
        doc.addPage();
        y = 20;
      }

      doc.text(lines, x, y);
      y += lines.length * 5 + 5; // spacing below
    });

    doc.save("Screenplay.pdf");
    onClose();
  };

  const handleExportFDX = () => {
    // Generate basic XML string for .fdx
    const fdxHeader = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<FinalDraft DocumentType="Script" Template="No" Version="3">
  <Content>`;
    const fdxFooter = `
  </Content>
</FinalDraft>`;
    
    const content = scriptBlocks.map(block => {
      let typeMap = "Action";
      if (block.type === 'slugline') typeMap = "Scene Heading";
      if (block.type === 'character') typeMap = "Character";
      if (block.type === 'dialogue') typeMap = "Dialogue";
      if (block.type === 'parenthetical') typeMap = "Parenthetical";
      
      return `\n    <Paragraph Type="${typeMap}">
      <Text>${block.text}</Text>
    </Paragraph>`;
    }).join("");

    const blob = new Blob([fdxHeader + content + fdxFooter], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Screenplay.fdx";
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Export Script</DialogTitle>
        <DialogDescription>
          Download your screenplay in industry standard formats.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <Button onClick={handleExportPDF} className="w-full">
          Download as PDF
        </Button>
        <Button onClick={handleExportFDX} variant="outline" className="w-full">
          Download as .fdx (Final Draft)
        </Button>
      </div>
    </>
  );
};
