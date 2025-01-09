# Operating System

## Installation

### macOS

Install Homebrew and run this command to get all tools you need:

```bash
brew install llvm lld qemu
```

### Ubuntu

Install packages with apt:

```bash
sudo apt update && sudo apt install -y clang llvm lld qemu-system-riscv32 curl
```

Also, download OpenSBI (think of it as BIOS/UEFI for PCs):

```bash
curl -LO https://github.com/qemu/qemu/raw/v8.0.4/pc-bios/opensbi-riscv32-generic-fw_dynamic.bin
```

When you run QEMU, make sure `opensbi-riscv32-generic-fw_dynamic.bin` is in your current directory. If it's not, you'll see this error:

```bash
qemu-system-riscv32: Unable to load the RISC-V firmware "opensbi-riscv32-generic-fw_dynamic.bin"
```
