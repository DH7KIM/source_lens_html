// ======================= 모달 표 창 공통 (지원 파일 형식 창, 앞으로 언어 선택 창) =======================
// 창 틀(<dialog> 안의 머리 줄·필터 상자·표 본문)과 필터·닫기 동작을 한곳에 모아, 표 창마다 같은 코드를 되풀이하지 않는다.
// 행은 data-find 에 "필터가 앞부분을 비교하는 낱말들"(공백으로 구분, 소문자)을 담아 둔다. 표 그리기는 창마다 따로 한다.

// 필터: data-find 의 낱말이 입력한 글로 시작하는 행만 보임. "py"·".py"·"*.py"·"Makefile"·"C++" 모두 같은 방식 (대소문자 구분 없음)
// 글자가 중간에 들어 있는 것은 맞추지 않음: "py"가 "copying"(License)에 맞으면 ".py 지원 여부" 확인이 틀려짐
// noneKey: 맞는 행이 없을 때 보여 줄 글의 번역 키 ({0} = 입력한 글)
function filterTableRows(input, body, none, noneKey) {
  const raw = input.value.trim();
  const q = raw.toLowerCase().replace(/^[*.]+/, "");
  let shown = 0;
  for (const tr of body.querySelectorAll("tbody tr")) {
    const ok = !q || tr.dataset.find.split(" ").some(w => w.startsWith(q));
    tr.hidden = !ok;
    if (ok) shown++;
  }
  none.hidden = shown > 0;   // 맞는 행이 없으면 알림
  if (!none.hidden) none.textContent = t(noneKey, raw);
}

// 표 창 열기: 필터를 비우고 → 표를 그리고 → 창을 열고 → 필터에 초점. 그리기가 끝난 뒤 현재 행(tr.current)이 있으면 가운데로 스크롤
// (머리 줄에 가리지 않게). draw 는 표를 그리는 함수
function openTableDialog(dlg, input, body, draw) {
  input.value = "";   // 열 때마다 처음부터
  draw();
  dlg.showModal();
  input.focus({ preventScroll: true });
  const row = body.querySelector("tr.current");
  if (row) row.scrollIntoView({ block: "center" });
}

// 닫기 단추와 창 바깥(어두운 곳) 누르기로 닫음. Esc는 브라우저가 처리
function wireTableDialog(dlg, closeBtn) {
  closeBtn.onclick = () => dlg.close();
  dlg.onclick = e => { if (e.target === dlg) dlg.close(); };
}
