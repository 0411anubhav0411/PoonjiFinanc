import pytest

from lib.career import validate_resume_upload


class FakeFile:
    def __init__(self, filename: str, content_type: str, data: bytes):
        self.filename = filename
        self.content_type = content_type
        self.data = data


def test_valid_pdf_passes_validation():
    file = FakeFile("resume.pdf", "application/pdf", b"%PDF-1.4\n% dummy pdf")

    assert validate_resume_upload(file.data, file.filename, file.content_type) is None


def test_rejects_non_pdf_file():
    file = FakeFile("resume.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", b"doc")

    with pytest.raises(ValueError, match="PDF"):
        validate_resume_upload(file.data, file.filename, file.content_type)


def test_rejects_files_over_5mb():
    file = FakeFile("resume.pdf", "application/pdf", b"a" * (5 * 1024 * 1024 + 1))

    with pytest.raises(ValueError, match="5 MB"):
        validate_resume_upload(file.data, file.filename, file.content_type)
